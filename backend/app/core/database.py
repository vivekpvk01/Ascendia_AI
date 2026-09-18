"""
Ascendia AI — MongoDB database connection

Provides a Motor async client and database accessor.
Uses the MONGODB_URI from settings.

Usage in route handlers (via FastAPI Depends):
    db: AsyncIOMotorDatabase = Depends(get_db)
"""

import logging
from functools import lru_cache
from typing import AsyncGenerator

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# Module-level client — created once and reused.
# Motor manages connection pooling internally.
_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    """Return (and lazily create) the shared Motor client."""
    import sys
    settings = get_settings()
    
    # In pytest with TestClient, each request runs in a new event loop. 
    # MotorClient binds to the event loop on creation. We must create a new client per request in tests.
    if "pytest" in sys.modules:
        return AsyncIOMotorClient(settings.mongodb_uri)
        
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongodb_uri)
        logger.info("MongoDB client initialised.")
    return _client


def get_db() -> AsyncIOMotorDatabase:
    """
    FastAPI dependency — returns the application database.

    The database name is derived from the MongoDB URI.
    If the URI contains a path component (e.g. /ascendia), that becomes the
    database name. Otherwise we fall back to 'ascendia'.
    """
    client = get_client()
    settings = get_settings()

    # Parse database name from URI path, fall back to 'ascendia'
    from urllib.parse import urlparse
    parsed = urlparse(settings.mongodb_uri)
    db_name = parsed.path.lstrip("/").split("?")[0] or "ascendia"

    return client[db_name]


async def close_db() -> None:
    """Close the MongoDB client. Call during application shutdown."""
    global _client
    if _client is not None:
        _client.close()
        _client = None
        logger.info("MongoDB client closed.")
