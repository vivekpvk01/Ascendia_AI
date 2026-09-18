"""
Ascendia AI — Structured Logging

Configures the application logger to emit structured output.
In development, uses a readable human format.
In production, this should be extended to JSON (e.g. structlog or python-json-logger).

SECURITY: Never log raw file contents, passwords, API keys, or sensitive tokens.
"""

import logging
import sys
from typing import Optional

from app.core.config import get_settings


def configure_logging(level: Optional[str] = None) -> None:
    """
    Set up root logger with a consistent format.

    Args:
        level: Optional override for log level. Defaults to DEBUG in development,
               INFO in other environments.
    """
    settings = get_settings()

    if level is None:
        log_level = logging.DEBUG if settings.is_development else logging.INFO
    else:
        log_level = getattr(logging, level.upper(), logging.INFO)

    fmt = "[%(asctime)s] %(levelname)-8s %(name)s — %(message)s"
    date_fmt = "%Y-%m-%d %H:%M:%S"

    logging.basicConfig(
        level=log_level,
        format=fmt,
        datefmt=date_fmt,
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    # Suppress noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("multipart").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Return a named logger. Call once per module."""
    return logging.getLogger(name)
