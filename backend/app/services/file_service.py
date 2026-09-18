"""
Ascendia AI — File Validation and Storage Service

Responsibilities:
  - Validate uploaded file extension and content type
  - Enforce configurable file size limits
  - Store files with randomized names (never original user filenames)
  - Provide a clear interface for swapping storage backends in future phases

SECURITY NOTES:
  - Original filenames are sanitized and never used as storage keys.
  - Storage keys are UUIDs with sanitized extensions only.
  - MIME type is verified using content sniffing (filetype library),
    not trusting the client-provided Content-Type header alone.
  - File contents are never executed.
  - Internal paths are never exposed in error responses.
"""

import logging
import re
from pathlib import Path

import filetype
from fastapi import UploadFile

from app.core.config import Settings
from app.utils.id import generate_upload_id

logger = logging.getLogger(__name__)


class FileValidationError(Exception):
    """Raised when an uploaded file fails validation."""

    def __init__(self, code: str, message: str) -> None:
        self.code = code
        self.message = message
        super().__init__(message)


class StoredFile:
    """Result of a successful file storage operation."""

    __slots__ = ("upload_id", "storage_path", "original_filename", "file_type", "file_size")

    def __init__(
        self,
        upload_id: str,
        storage_path: Path,
        original_filename: str,
        file_type: str,
        file_size: int,
    ) -> None:
        self.upload_id = upload_id
        self.storage_path = storage_path
        self.original_filename = original_filename
        self.file_type = file_type
        self.file_size = file_size


def _sanitize_filename(filename: str) -> str:
    """
    Return a safe version of the filename for display purposes only.
    Strips path components and replaces non-alphanumeric characters.
    This result is NEVER used as a storage key.
    """
    # Remove path separators
    name = Path(filename).name
    # Allow only safe characters
    name = re.sub(r"[^\w.\-]", "_", name)
    # Collapse repeated dots or underscores
    name = re.sub(r"\.{2,}", ".", name)
    return name[:255]  # Reasonable filename length cap


def _get_extension(filename: str) -> str:
    """Return the lowercased file extension including the dot, e.g. '.pdf'."""
    return Path(filename).suffix.lower()


async def validate_and_store_file(
    upload: UploadFile,
    settings: Settings,
) -> StoredFile:
    """
    Validate an uploaded file and persist it to local storage.

    Validation steps (order matters):
      1. Filename present
      2. Extension is in the supported list
      3. File size within configured limit
      4. Content-type sniffing (independent of client header)

    Args:
        upload:   The raw FastAPI UploadFile object.
        settings: Application settings (for size limit, upload dir, allowed types).

    Returns:
        StoredFile with metadata about the saved file.

    Raises:
        FileValidationError: On any validation failure.
    """
    # ── 1. Filename must be present ────────────────────────────────────────────
    if not upload.filename:
        raise FileValidationError(
            code="MISSING_FILENAME",
            message="No file was provided.",
        )

    original_filename = _sanitize_filename(upload.filename)
    extension = _get_extension(upload.filename)

    # ── 2. Extension check ─────────────────────────────────────────────────────
    if extension not in settings.SUPPORTED_EXTENSIONS:
        readable = ", ".join(
            ext.lstrip(".").upper() for ext in settings.SUPPORTED_EXTENSIONS
        )
        raise FileValidationError(
            code="UNSUPPORTED_FILE_TYPE",
            message=f"Please upload a supported format: {readable}.",
        )

    # ── 3. Read file content (needed for size and MIME checks) ─────────────────
    content = await upload.read()
    file_size = len(content)

    if file_size == 0:
        raise FileValidationError(
            code="EMPTY_FILE",
            message="The uploaded file is empty.",
        )

    if file_size > settings.max_upload_size_bytes:
        max_mb = settings.max_upload_size_mb
        raise FileValidationError(
            code="FILE_TOO_LARGE",
            message=f"File exceeds the maximum allowed size of {max_mb} MB.",
        )

    # ── 4. MIME / content-type sniffing ────────────────────────────────────────
    # We use the 'filetype' library which inspects the file's magic bytes,
    # independent of the client-supplied Content-Type header.
    # For plain text (.txt), magic bytes are unreliable — fall back to extension.
    file_type_label = settings.SUPPORTED_EXTENSIONS[extension]

    if extension != ".txt":
        detected = filetype.guess(content)
        if detected is not None:
            detected_mime = detected.mime
            if detected_mime not in settings.SUPPORTED_MIME_TYPES:
                raise FileValidationError(
                    code="CONTENT_TYPE_MISMATCH",
                    message=(
                        "The file's content does not match its extension. "
                        "Please upload a genuine PDF, DOCX, PNG, JPG, or TXT file."
                    ),
                )
            # Use the sniffed type as the canonical label
            file_type_label = settings.SUPPORTED_MIME_TYPES[detected_mime]
        else:
            # filetype returned None — couldn't identify. For non-text files this
            # is suspicious; log a warning but proceed with extension-based label.
            logger.warning(
                "Could not sniff MIME type for extension=%s filename=%s — "
                "proceeding with extension-based validation only.",
                extension,
                original_filename,
            )

    # ── 5. Store with randomized UUID filename ─────────────────────────────────
    upload_id = generate_upload_id()
    storage_filename = f"{upload_id}{extension}"
    storage_path = settings.upload_path / storage_filename

    try:
        storage_path.write_bytes(content)
    except OSError as exc:
        # Log the real error internally; never expose the path to the client.
        logger.error("Failed to write upload to disk. upload_id=%s error=%s", upload_id, exc)
        raise FileValidationError(
            code="STORAGE_ERROR",
            message="We couldn't save the uploaded file. Please try again.",
        ) from exc

    logger.info(
        "File stored. upload_id=%s file_type=%s size_bytes=%d",
        upload_id,
        file_type_label,
        file_size,
    )

    return StoredFile(
        upload_id=upload_id,
        storage_path=storage_path,
        original_filename=original_filename,
        file_type=file_type_label,
        file_size=file_size,
    )
