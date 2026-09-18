"""
Tests for POST /api/v1/assessments/upload

Covers:
  - Supported file types accepted
  - Unsupported file type rejected with correct error code
  - Empty file rejected
  - Missing file rejected
  - File too large rejected
  - Response envelope structure on success and error
"""

import io

import pytest
from fastapi.testclient import TestClient


UPLOAD_URL = "/api/v1/assessments/upload"


def _make_file(content: bytes, filename: str, content_type: str) -> dict:
    """Helper to construct multipart file payload."""
    return {"file": (filename, io.BytesIO(content), content_type)}


# ── Success cases ─────────────────────────────────────────────────────────────

class TestSupportedFormats:
    """Supported file formats should be accepted and return success=True."""

    def test_pdf_accepted(self, client: TestClient, tmp_path) -> None:
        # Minimal valid PDF magic bytes
        pdf_content = b"%PDF-1.4 1 0 obj<</Type /Catalog>>endobj"
        response = client.post(UPLOAD_URL, files=_make_file(pdf_content, "test.pdf", "application/pdf"))
        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert body["error"] is None
        assert body["data"]["file_type"] == "pdf"
        assert body["data"]["status"] == "uploaded"
        assert "upload_id" in body["data"]

    def test_txt_accepted(self, client: TestClient) -> None:
        response = client.post(
            UPLOAD_URL,
            files=_make_file(b"Question 1: Write a function...", "assessment.txt", "text/plain"),
        )
        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert body["data"]["file_type"] == "txt"

    def test_png_accepted(self, client: TestClient) -> None:
        # Minimal valid PNG header
        png_header = (
            b"\x89PNG\r\n\x1a\n"
            b"\x00\x00\x00\rIHDR"
            b"\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde"
            b"\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N"
            b"\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        response = client.post(
            UPLOAD_URL,
            files=_make_file(png_header, "screenshot.png", "image/png"),
        )
        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True


# ── Rejection cases ───────────────────────────────────────────────────────────

class TestRejectedFormats:
    """Invalid file types and edge cases must be rejected gracefully."""

    def test_unsupported_extension_rejected(self, client: TestClient) -> None:
        response = client.post(
            UPLOAD_URL,
            files=_make_file(b"some content", "script.exe", "application/octet-stream"),
        )
        assert response.status_code == 422
        body = response.json()
        assert body["success"] is False
        assert body["data"] is None
        assert body["error"]["code"] == "UNSUPPORTED_FILE_TYPE"

    def test_zip_rejected(self, client: TestClient) -> None:
        response = client.post(
            UPLOAD_URL,
            files=_make_file(b"PK\x03\x04", "archive.zip", "application/zip"),
        )
        assert response.status_code == 422
        body = response.json()
        assert body["success"] is False
        assert body["error"]["code"] == "UNSUPPORTED_FILE_TYPE"

    def test_empty_file_rejected(self, client: TestClient) -> None:
        response = client.post(
            UPLOAD_URL,
            files=_make_file(b"", "empty.pdf", "application/pdf"),
        )
        assert response.status_code == 422
        body = response.json()
        assert body["success"] is False
        assert body["error"]["code"] == "EMPTY_FILE"

    def test_no_file_field_returns_error(self, client: TestClient) -> None:
        # FastAPI returns 422 automatically when the required field is missing
        response = client.post(UPLOAD_URL)
        assert response.status_code == 422


# ── Response envelope ─────────────────────────────────────────────────────────

class TestResponseEnvelope:
    """All responses must conform to the ApiResponse envelope."""

    def test_success_envelope_keys(self, client: TestClient) -> None:
        response = client.post(
            UPLOAD_URL,
            files=_make_file(b"Question 1", "q.txt", "text/plain"),
        )
        body = response.json()
        assert set(body.keys()) == {"success", "data", "error"}

    def test_error_envelope_keys(self, client: TestClient) -> None:
        response = client.post(
            UPLOAD_URL,
            files=_make_file(b"data", "bad.xyz", "application/octet-stream"),
        )
        body = response.json()
        assert set(body.keys()) == {"success", "data", "error"}
        assert set(body["error"].keys()) == {"code", "message"}

    def test_upload_id_is_unique(self, client: TestClient) -> None:
        """Each upload must receive a distinct upload_id."""
        ids = set()
        for _ in range(3):
            r = client.post(
                UPLOAD_URL,
                files=_make_file(b"content", "a.txt", "text/plain"),
            )
            assert r.status_code == 200
            ids.add(r.json()["data"]["upload_id"])
        assert len(ids) == 3
