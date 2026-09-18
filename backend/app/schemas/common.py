"""
Ascendia AI — Common API schemas

Defines the ApiResponse[T] envelope used by every endpoint,
ensuring a consistent, predictable response structure across the API.
"""

from typing import Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiError(BaseModel):
    """Structured error payload returned when success=False."""

    code: str
    message: str


class ApiResponse(BaseModel, Generic[T]):
    """
    Envelope for all API responses.

    Every endpoint returns this structure so clients can rely on a
    consistent shape regardless of the endpoint.

    Example (success):
        {"success": true, "data": {...}, "error": null}

    Example (error):
        {"success": false, "data": null, "error": {"code": "...", "message": "..."}}
    """

    success: bool
    data: Optional[T] = None
    error: Optional[ApiError] = None

    @classmethod
    def ok(cls, data: T) -> "ApiResponse[T]":
        """Convenience factory for a successful response."""
        return cls(success=True, data=data, error=None)

    @classmethod
    def fail(cls, code: str, message: str) -> "ApiResponse[None]":
        """Convenience factory for an error response."""
        return cls(
            success=False,
            data=None,
            error=ApiError(code=code, message=message),
        )
