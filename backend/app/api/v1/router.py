"""
Ascendia AI — API v1 Router

Aggregates all v1 route modules under /api/v1.
"""

from fastapi import APIRouter

from app.api.v1.routes import assessments, health

router = APIRouter(prefix="/api/v1")

router.include_router(health.router)
router.include_router(assessments.router, prefix="/assessments" if False else "")
# Note: assessments routes already have their own prefix in the path strings.
# Health is at /api/v1/health, assessments at /api/v1/assessments/upload.
