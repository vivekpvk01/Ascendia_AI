"""
Ascendia AI — PracticeQuestion Repository

Thin database access layer for PracticeQuestion documents.
All authorization logic is enforced in the service layer.
"""

import logging
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.practice_question import (
    PracticeQuestionDocument,
    QuestionStatus,
    QuestionVisibility,
)

logger = logging.getLogger(__name__)

COLLECTION = "practice_questions"


def _doc_to_question(doc: dict) -> PracticeQuestionDocument:
    doc["_id"] = str(doc["_id"])
    return PracticeQuestionDocument(**doc)


async def find_questions_for_student(
    db: AsyncIOMotorDatabase,
    user_id: str,
    difficulty: Optional[str] = None,
    topic: Optional[str] = None,
    source_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> list[PracticeQuestionDocument]:
    """
    Return questions visible to a student:
    - Published public questions (admin-created)
    - Student's own questions (any status, any visibility)
    """
    query: dict = {
        "$or": [
            {
                "status": QuestionStatus.PUBLISHED.value,
                "visibility": QuestionVisibility.PUBLIC.value,
            },
            {"created_by": user_id},
        ]
    }

    if difficulty:
        query["difficulty"] = difficulty
    if topic:
        query["topics"] = topic
    if source_type:
        query["source_type"] = source_type

    cursor = db[COLLECTION].find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_doc_to_question(d) for d in docs]


async def find_question_by_id(
    db: AsyncIOMotorDatabase, question_id: str
) -> Optional[PracticeQuestionDocument]:
    """Find a question by its MongoDB ObjectId string."""
    try:
        oid = ObjectId(question_id)
    except Exception:
        return None
    doc = await db[COLLECTION].find_one({"_id": oid})
    if doc is None:
        return None
    return _doc_to_question(doc)


async def create_question(
    db: AsyncIOMotorDatabase, question: PracticeQuestionDocument
) -> PracticeQuestionDocument:
    """Insert a new practice question. Returns the document with assigned id."""
    data = question.model_dump(exclude={"id"}, by_alias=False)
    result = await db[COLLECTION].insert_one(data)
    question.id = str(result.inserted_id)

    # Ensure indexes (idempotent)
    await db[COLLECTION].create_index("created_by", background=True)
    await db[COLLECTION].create_index("status", background=True)
    await db[COLLECTION].create_index("visibility", background=True)
    await db[COLLECTION].create_index("difficulty", background=True)
    await db[COLLECTION].create_index("created_at", background=True)

    logger.info("Practice question created. id=%s title=%s", question.id, question.title)
    return question


async def update_question(
    db: AsyncIOMotorDatabase,
    question_id: str,
    updates: dict,
) -> Optional[PracticeQuestionDocument]:
    """
    Apply partial updates to a question.
    Callers must enforce authorization before calling this.
    """
    try:
        oid = ObjectId(question_id)
    except Exception:
        return None

    updates["updated_at"] = datetime.now(timezone.utc)
    result = await db[COLLECTION].find_one_and_update(
        {"_id": oid},
        {"$set": updates},
        return_document=True,
    )
    if result is None:
        return None
    return _doc_to_question(result)


async def delete_question(db: AsyncIOMotorDatabase, question_id: str) -> bool:
    """Delete a question by id. Returns True if deleted, False if not found."""
    try:
        oid = ObjectId(question_id)
    except Exception:
        return False
    result = await db[COLLECTION].delete_one({"_id": oid})
    return result.deleted_count > 0


async def find_all_questions_admin(
    db: AsyncIOMotorDatabase,
    skip: int = 0,
    limit: int = 100,
) -> list[PracticeQuestionDocument]:
    """Admin-only: return all questions regardless of status/visibility."""
    cursor = db[COLLECTION].find({}).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_doc_to_question(d) for d in docs]
