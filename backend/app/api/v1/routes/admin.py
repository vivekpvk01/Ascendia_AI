"""
Ascendia AI — Admin routes
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.auth import require_admin
from app.core.database import get_db
from app.models.user import UserDocument
from app.schemas.common import ApiResponse
from app.schemas.practice import PracticeQuestionCreate, PracticeQuestionUpdate, PracticeQuestionPublic
from app.services.practice_service import (
    list_admin_questions,
    create_admin_question,
    update_admin_question,
    delete_admin_question,
    _to_public,
)

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/questions", response_model=ApiResponse[list[PracticeQuestionPublic]])
async def list_questions(
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: UserDocument = Depends(require_admin),
) -> JSONResponse:
    questions = await list_admin_questions(db)
    return JSONResponse(
        status_code=200,
        content=ApiResponse.ok([_to_public(q) for q in questions]).model_dump(mode="json"),
    )


@router.post("/questions", response_model=ApiResponse[PracticeQuestionPublic])
async def create_question(
    request: PracticeQuestionCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: UserDocument = Depends(require_admin),
) -> JSONResponse:
    q = await create_admin_question(db, request, user)
    return JSONResponse(
        status_code=201,
        content=ApiResponse.ok(_to_public(q)).model_dump(mode="json"),
    )


@router.patch("/questions/{id}", response_model=ApiResponse[PracticeQuestionPublic])
async def update_question(
    id: str,
    request: PracticeQuestionUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: UserDocument = Depends(require_admin),
) -> JSONResponse:
    q = await update_admin_question(db, id, request, user)
    return JSONResponse(
        status_code=200,
        content=ApiResponse.ok(_to_public(q)).model_dump(mode="json"),
    )


@router.delete("/questions/{id}", response_model=ApiResponse[None])
async def delete_question(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: UserDocument = Depends(require_admin),
) -> JSONResponse:
    await delete_admin_question(db, id)
    return JSONResponse(
        status_code=200,
        content=ApiResponse.ok(None).model_dump(mode="json"),
    )
