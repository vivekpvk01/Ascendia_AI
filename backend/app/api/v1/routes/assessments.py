"""
Ascendia AI — Assessment routes

POST /api/v1/assessments/upload

Routes are intentionally thin. All business logic lives in the service layer.
"""

import logging
import uuid

from fastapi import APIRouter, Depends, Request, UploadFile
from fastapi.responses import JSONResponse

from app.core.config import Settings, get_settings
from app.schemas.assessment import UploadedFileData
from app.schemas.common import ApiResponse
from app.services.assessment_service import ingest_assessment_file
from app.services.file_service import FileValidationError

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(
    "/assessments/upload",
    response_model=ApiResponse[UploadedFileData],
    summary="Upload an assessment file",
    description=(
        "Accepts a PDF, DOCX, PNG, JPG, or TXT file containing placement assessment "
        "material. Validates the file independently of client-supplied metadata, "
        "stores it under a randomized identifier, and returns structured upload metadata."
    ),
    tags=["Assessments"],
)
async def upload_assessment(
    request: Request,
    file: UploadFile,
    settings: Settings = Depends(get_settings),
) -> JSONResponse:
    """
    Handle assessment file upload.

    Security:
      - File extension and MIME content are both validated server-side.
      - The original filename is never used as a storage key.
      - Internal paths and error details are never returned to the client.
    """
    request_id = str(uuid.uuid4())[:8]
    logger.info(
        "Upload request received. request_id=%s content_type=%s",
        request_id,
        file.content_type,
    )

    try:
        result: UploadedFileData = await ingest_assessment_file(file, settings)
        logger.info(
            "Upload successful. request_id=%s upload_id=%s",
            request_id,
            result.upload_id,
        )
        return JSONResponse(
            status_code=200,
            content=ApiResponse.ok(result).model_dump(),
        )

    except FileValidationError as exc:
        logger.warning(
            "Upload validation failed. request_id=%s code=%s message=%s",
            request_id,
            exc.code,
            exc.message,
        )
        return JSONResponse(
            status_code=422,
            content=ApiResponse.fail(code=exc.code, message=exc.message).model_dump(),
        )

    except Exception as exc:  # noqa: BLE001
        # Catch-all: log the full error internally, return a generic message.
        # Never expose internal errors to the client.
        logger.exception(
            "Unexpected error during upload. request_id=%s error=%s",
            request_id,
            exc,
        )
        return JSONResponse(
            status_code=500,
            content=ApiResponse.fail(
                code="INTERNAL_ERROR",
                message="We couldn't process your assessment right now. Please try again.",
            ).model_dump(),
        )
