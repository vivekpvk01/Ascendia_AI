"""
Ascendia AI — Application Configuration

All settings are loaded from environment variables (with .env fallback).
Never hardcode secrets. See .env.example for required variables.
"""

import os
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "Ascendia AI"
    app_version: str = "0.1.0"
    app_env: str = "development"

    # Session — must be a long random string; set in .env
    session_secret: str = "CHANGE_ME_IN_PRODUCTION_USE_A_LONG_RANDOM_SECRET"

    # CORS — comma-separated list of allowed origins
    cors_origins: str = "http://localhost:3000"

    # Database (stubbed for Phase 1 — no active connection required)
    mongodb_uri: str = "mongodb://localhost:27017/ascendia"

    # File uploads
    max_upload_size_mb: int = 10
    upload_dir: str = "uploads"

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

    @property
    def allowed_cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir)
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"

    # Supported upload MIME types and their canonical labels
    SUPPORTED_MIME_TYPES: dict[str, str] = {
        "application/pdf": "pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "image/png": "png",
        "image/jpeg": "jpg",
        "text/plain": "txt",
    }

    # Extension → canonical label (used as fallback when MIME sniffing fails)
    SUPPORTED_EXTENSIONS: dict[str, str] = {
        ".pdf": "pdf",
        ".docx": "docx",
        ".png": "png",
        ".jpg": "jpg",
        ".jpeg": "jpg",
        ".txt": "txt",
    }


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance. Use as a FastAPI dependency."""
    return Settings()
