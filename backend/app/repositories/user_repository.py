"""
Ascendia AI — User Repository

Thin database access layer for User documents.
All business logic lives in the service layer — not here.
"""

import logging
from typing import Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.user import UserDocument

logger = logging.getLogger(__name__)

COLLECTION = "users"


def _doc_to_user(doc: dict) -> UserDocument:
    """Convert a MongoDB document dict to a UserDocument."""
    doc["_id"] = str(doc["_id"])
    return UserDocument(**doc)


async def find_user_by_email(db: AsyncIOMotorDatabase, email: str) -> Optional[UserDocument]:
    """Find a user by their email address. Returns None if not found."""
    doc = await db[COLLECTION].find_one({"email": email.lower().strip()})
    if doc is None:
        return None
    return _doc_to_user(doc)


async def find_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> Optional[UserDocument]:
    """Find a user by their MongoDB ObjectId string. Returns None if not found."""
    try:
        oid = ObjectId(user_id)
    except Exception:
        return None
    doc = await db[COLLECTION].find_one({"_id": oid})
    if doc is None:
        return None
    return _doc_to_user(doc)


async def create_user(db: AsyncIOMotorDatabase, user: UserDocument) -> UserDocument:
    """
    Insert a new user into the database.
    Returns the created UserDocument with the assigned id.
    """
    data = user.model_dump(exclude={"id"}, by_alias=False)
    result = await db[COLLECTION].insert_one(data)
    user.id = str(result.inserted_id)

    # Ensure email index exists (idempotent)
    await db[COLLECTION].create_index("email", unique=True, background=True)

    logger.info("User created. user_id=%s email=%s", user.id, user.email)
    return user
