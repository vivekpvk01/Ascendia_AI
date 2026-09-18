"""
Tests for GET /api/v1/health
"""

from fastapi.testclient import TestClient


def test_health_returns_200(client: TestClient) -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_response_structure(client: TestClient) -> None:
    response = client.get("/api/v1/health")
    body = response.json()
    assert "status" in body
    assert "version" in body
    assert "environment" in body


def test_health_status_is_ok(client: TestClient) -> None:
    response = client.get("/api/v1/health")
    assert response.json()["status"] == "ok"
