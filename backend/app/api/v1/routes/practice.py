"""
Ascendia AI — Practice routes
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import UserDocument
from app.schemas.common import ApiResponse
from app.schemas.practice import PracticeQuestionCreate, PracticeQuestionUpdate, PracticeQuestionPublic
from app.services.practice_service import (
    list_questions,
    get_question,
    create_user_question,
    update_user_question,
    delete_user_question,
    _to_public,
)

router = APIRouter(prefix="/practice", tags=["Practice"])


@router.get("", response_model=ApiResponse[list[PracticeQuestionPublic]])
async def api_list_questions(
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: UserDocument = Depends(get_current_user),
) -> JSONResponse:
    questions = await list_questions(db, user)
    return JSONResponse(
        status_code=200,
        content=ApiResponse.ok([_to_public(q) for q in questions]).model_dump(mode="json"),
    )


@router.get("/{id}", response_model=ApiResponse[PracticeQuestionPublic])
async def api_get_question(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: UserDocument = Depends(get_current_user),
) -> JSONResponse:
    q = await get_question(db, id, user)
    return JSONResponse(
        status_code=200,
        content=ApiResponse.ok(q).model_dump(mode="json"),  # q is already public from service
    )


@router.post("", response_model=ApiResponse[PracticeQuestionPublic])
async def api_create_question(
    request: PracticeQuestionCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: UserDocument = Depends(get_current_user),
) -> JSONResponse:
    q = await create_user_question(db, request, user)
    return JSONResponse(
        status_code=201,
        content=ApiResponse.ok(q).model_dump(mode="json"),
    )


@router.patch("/{id}", response_model=ApiResponse[PracticeQuestionPublic])
async def api_update_question(
    id: str,
    request: PracticeQuestionUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: UserDocument = Depends(get_current_user),
) -> JSONResponse:
    q = await update_user_question(db, id, request, user)
    return JSONResponse(
        status_code=200,
        content=ApiResponse.ok(q).model_dump(mode="json"),
    )


@router.delete("/{id}", response_model=ApiResponse[None])
async def api_delete_question(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: UserDocument = Depends(get_current_user),
) -> JSONResponse:
    await delete_user_question(db, id, user)
    return JSONResponse(
        status_code=200,
        content=ApiResponse.ok(None).model_dump(mode="json"),
    )
