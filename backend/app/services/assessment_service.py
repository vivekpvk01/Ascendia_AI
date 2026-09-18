"""
Ascendia AI — Assessment Service

Orchestrates the assessment upload workflow.

In Phase 1, the pipeline ends at file storage.
Future phases will extend this service to:
  - Trigger OCR / document parsing
  - Call the AI extraction pipeline (app/ai/)
  - Persist a structured Assessment record to MongoDB
  - Generate interactive problems

The service layer deliberately keeps the route handler thin —
routes validate HTTP concerns, services own business logic.
"""

import logging

from fastapi import UploadFile

from app.core.config import Settings
from app.schemas.assessment import UploadStatus, UploadedFileData
from app.services.file_service import StoredFile, validate_and_store_file

logger = logging.getLogger(__name__)


async def ingest_assessment_file(
    upload: UploadFile,
    settings: Settings,
) -> UploadedFileData:
    """
    Accept an uploaded file, validate it, store it, and return structured metadata.

    This is the Phase 1 entry point for the assessment ingestion pipeline.

    Args:
        upload:   Raw UploadFile from the route handler.
        settings: Application settings injected via FastAPI dependency.

    Returns:
        UploadedFileData describing the stored file.

    Raises:
        FileValidationError: Propagated from file_service on validation failure.
    """
    stored: StoredFile = await validate_and_store_file(upload, settings)

    logger.info(
        "Assessment ingestion complete. upload_id=%s status=%s",
        stored.upload_id,
        UploadStatus.UPLOADED.value,
    )

    return UploadedFileData(
        upload_id=stored.upload_id,
        filename=stored.original_filename,
        file_type=stored.file_type,
        file_size=stored.file_size,
        status=UploadStatus.UPLOADED,
    )
