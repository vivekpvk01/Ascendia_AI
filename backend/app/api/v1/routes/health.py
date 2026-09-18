"""
Ascendia AI — Health check route

GET /health — used by load balancers, Docker health checks, and monitoring.
"""

import logging

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import get_settings

router = APIRouter()
logger = logging.getLogger(__name__)


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str


@router.get("/health", response_model=HealthResponse, tags=["Infrastructure"])
async def health_check() -> HealthResponse:
    """
    Returns the application's operational status.

    This endpoint intentionally does NOT check database connectivity
    in Phase 1 — it confirms the application process is running.
    A deeper readiness check (database ping) should be added in Phase 2.
    """
    settings = get_settings()
    logger.debug("Health check requested.")
    return HealthResponse(
        status="ok",
        version=settings.app_version,
        environment=settings.app_env,
    )
