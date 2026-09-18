"""
Ascendia AI — Practice Service

Business logic for practice question operations.
Enforces ownership and visibility rules.
"""

import logging
from typing import Optional

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.practice_question import (
    PracticeQuestionDocument,
    QuestionStatus,
    QuestionVisibility,
    SourceType,
)
from app.models.user import UserDocument, UserRole
from app.repositories.practice_repository import (
    create_question,
    delete_question,
    find_question_by_id,
    find_questions_for_student,
    update_question,
)
from app.schemas.practice import (
    PracticeQuestionCreate,
    PracticeQuestionPublic,
    PracticeQuestionUpdate,
)

logger = logging.getLogger(__name__)


def _to_public(q: PracticeQuestionDocument) -> PracticeQuestionPublic:
    """Convert document to the safe public schema (no hidden tests)."""
    return PracticeQuestionPublic(
        id=q.id or "",
        title=q.title,
        statement=q.statement,
        constraints=q.constraints,
        input_format=q.input_format,
        output_format=q.output_format,
        sample_tests=q.sample_tests,
        difficulty=q.difficulty,
        topics=q.topics,
        source_type=q.source_type,
        created_by=q.created_by,
        assessment_id=q.assessment_id,
        visibility=q.visibility,
        status=q.status,
        created_at=q.created_at,
        updated_at=q.updated_at,
    )


async def list_questions(
    db: AsyncIOMotorDatabase,
    current_user: UserDocument,
    difficulty: Optional[str] = None,
    topic: Optional[str] = None,
    source_type: Optional[str] = None,
) -> list[PracticeQuestionPublic]:
    """Return questions visible to the current user."""
    questions = await find_questions_for_student(
        db,
        user_id=current_user.id or "",
        difficulty=difficulty,
        topic=topic,
        source_type=source_type,
    )
    return [_to_public(q) for q in questions]


async def get_question(
    db: AsyncIOMotorDatabase,
    question_id: str,
    current_user: UserDocument,
) -> PracticeQuestionPublic:
    """
    Get a single question by id.
    Authorization:
    - Published public questions: visible to all authenticated users.
    - Private questions: only visible to their creator.
    """
    q = await find_question_by_id(db, question_id)
    if q is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")

    is_owner = q.created_by == (current_user.id or "")
    is_public_published = (
        q.status == QuestionStatus.PUBLISHED and q.visibility == QuestionVisibility.PUBLIC
    )
    is_admin = current_user.role == UserRole.ADMIN

    if not (is_owner or is_public_published or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Question not found.")

    return _to_public(q)


async def create_user_question(
    db: AsyncIOMotorDatabase,
    data: PracticeQuestionCreate,
    current_user: UserDocument,
) -> PracticeQuestionPublic:
    """
    Create a new practice question owned by the current user.
    Source type is always set to 'user' here — admin creation goes through the admin service.
    Status defaults to 'draft'. Visibility defaults to 'private'.
    """
    question = PracticeQuestionDocument(
        title=data.title,
        statement=data.statement,
        constraints=data.constraints,
        input_format=data.input_format,
        output_format=data.output_format,
        sample_tests=data.sample_tests,
        difficulty=data.difficulty,
        topics=data.topics,
        source_type=SourceType.USER,
        created_by=current_user.id or "",
        assessment_id=data.assessment_id,
        visibility=QuestionVisibility.PRIVATE,  # Always private by default
        status=QuestionStatus.DRAFT,
    )
    created = await create_question(db, question)
    return _to_public(created)


async def update_user_question(
    db: AsyncIOMotorDatabase,
    question_id: str,
    data: PracticeQuestionUpdate,
    current_user: UserDocument,
) -> PracticeQuestionPublic:
    """
    Update a question. Enforces ownership — users can only edit their own questions.
    Admins can edit any question.
    """
    q = await find_question_by_id(db, question_id)
    if q is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")

    is_owner = q.created_by == (current_user.id or "")
    is_admin = current_user.role == UserRole.ADMIN

    if not (is_owner or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to edit this question.",
        )

    updates = data.model_dump(exclude_none=True)
    updated = await update_question(db, question_id, updates)
    if updated is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")
    return _to_public(updated)


async def delete_user_question(
    db: AsyncIOMotorDatabase,
    question_id: str,
    current_user: UserDocument,
) -> None:
    """
    Delete a question. Enforces ownership.
    Admins can delete any question.
    """
    q = await find_question_by_id(db, question_id)
    if q is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")

    is_owner = q.created_by == (current_user.id or "")
    is_admin = current_user.role == UserRole.ADMIN

    if not (is_owner or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this question.",
        )

    await delete_question(db, question_id)


async def list_admin_questions(
    db: AsyncIOMotorDatabase,
) -> list[PracticeQuestionPublic]:
    """Admin-only: return all questions."""
    from app.repositories.practice_repository import find_all_questions_admin
    questions = await find_all_questions_admin(db)
    return [_to_public(q) for q in questions]


async def create_admin_question(
    db: AsyncIOMotorDatabase,
    data: PracticeQuestionCreate,
    current_user: UserDocument,
) -> PracticeQuestionPublic:
    """Admin-only: create a curated question."""
    question = PracticeQuestionDocument(
        title=data.title,
        statement=data.statement,
        constraints=data.constraints,
        input_format=data.input_format,
        output_format=data.output_format,
        sample_tests=data.sample_tests,
        difficulty=data.difficulty,
        topics=data.topics,
        source_type=SourceType.CURATED,
        created_by=current_user.id or "",
        assessment_id=data.assessment_id,
        visibility=data.visibility or QuestionVisibility.PRIVATE,
        status=data.status or QuestionStatus.DRAFT,
    )
    from app.repositories.practice_repository import create_question
    created = await create_question(db, question)
    return _to_public(created)


async def update_admin_question(
    db: AsyncIOMotorDatabase,
    question_id: str,
    data: PracticeQuestionUpdate,
    current_user: UserDocument,
) -> PracticeQuestionPublic:
    """Admin-only: update any question."""
    from app.repositories.practice_repository import find_question_by_id, update_question
    q = await find_question_by_id(db, question_id)
    if q is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")
    
    updates = data.model_dump(exclude_none=True)
    updated = await update_question(db, question_id, updates)
    if updated is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")
    return _to_public(updated)


async def delete_admin_question(
    db: AsyncIOMotorDatabase,
    question_id: str,
) -> None:
    """Admin-only: delete any question."""
    from app.repositories.practice_repository import find_question_by_id, delete_question
    q = await find_question_by_id(db, question_id)
    if q is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")
    await delete_question(db, question_id)

