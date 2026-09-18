"""
Ascendia AI — API v1 Router

Aggregates all v1 route modules under /api/v1.
"""

from fastapi import APIRouter

from app.api.v1.routes import assessments, auth, health, practice, admin

router = APIRouter(prefix="/api/v1")

router.include_router(health.router)
router.include_router(assessments.router)
router.include_router(auth.router)
router.include_router(practice.router)
router.include_router(admin.router)
