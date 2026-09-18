"""
Ascendia AI — Assessment schemas

Pydantic models for assessment upload request/response.
"""

from enum import Enum

from pydantic import BaseModel


class UploadStatus(str, Enum):
    """Lifecycle states of an uploaded assessment file."""

    UPLOADED = "uploaded"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class UploadedFileData(BaseModel):
    """
    Payload returned after a successful assessment file upload.

    Fields:
        upload_id:  Opaque UUID identifying this upload. Used as the
                    internal storage key — the original filename is
                    never used for storage.
        filename:   The sanitized original filename as reported by the client.
        file_type:  Canonical file type label (e.g. 'pdf', 'docx').
        file_size:  File size in bytes.
        status:     Current lifecycle status of the upload.
    """

    upload_id: str
    filename: str
    file_type: str
    file_size: int
    status: UploadStatus
