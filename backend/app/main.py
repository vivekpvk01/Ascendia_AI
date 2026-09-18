"""
Ascendia AI — FastAPI application factory

Initializes the FastAPI app with:
  - CORS middleware
  - Structured logging
  - API v1 router
  - Global exception handler (prevents stack trace leakage)
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import router as api_v1_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.schemas.common import ApiResponse

# Configure logging before anything else touches the logger
configure_logging()

logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Handle application startup and shutdown lifecycle."""
    # Startup
    logger.info(
        "Ascendia AI starting. version=%s env=%s",
        settings.app_version,
        settings.app_env,
    )
    # Ensure upload directory exists at startup
    _ = settings.upload_path
    yield
    # Shutdown (add cleanup here in future phases)
    logger.info("Ascendia AI shutting down.")


def create_app() -> FastAPI:
    """
    Application factory pattern.
    Returns a fully configured FastAPI instance.
    """
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "Ascendia AI API — Transform placement assessment material "
            "into interactive coding practice sessions."
        ),
        lifespan=lifespan,
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        openapi_url="/openapi.json" if settings.is_development else None,
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    app.include_router(api_v1_router)

    # ── Global exception handler ──────────────────────────────────────────────
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """
        Catch-all handler — ensures no stack trace ever reaches the client.
        The full error is logged server-side for debugging.
        """
        logger.exception("Unhandled exception. path=%s error=%s", request.url.path, exc)
        return JSONResponse(
            status_code=500,
            content=ApiResponse.fail(
                code="INTERNAL_ERROR",
                message="An unexpected error occurred. Please try again.",
            ).model_dump(),
        )

    logger.info("Application factory complete.")
    return app


app = create_app()
