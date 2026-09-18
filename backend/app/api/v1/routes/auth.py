"""
Ascendia AI — Auth routes

POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
"""

import logging

from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.auth import get_current_user, get_optional_user
from app.core.database import get_db
from app.core.security import (
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
    create_session_token,
)
from app.models.user import UserDocument
from app.schemas.auth import LoginRequest, SignupRequest, UserPublic
from app.schemas.common import ApiResponse
from app.services.auth_service import login_user, signup_user, _to_public

router = APIRouter(prefix="/auth", tags=["Auth"])
logger = logging.getLogger(__name__)


@router.post(
    "/signup",
    response_model=ApiResponse[UserPublic],
    summary="Create a new account",
)
async def signup(
    request: SignupRequest,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> JSONResponse:
    user_public = await signup_user(db, request)

    token = create_session_token(user_public.id)
    response = JSONResponse(
        status_code=201,
        content=ApiResponse.ok(user_public).model_dump(mode="json"),
    )
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=SESSION_MAX_AGE_SECONDS,
        path="/",
    )
    return response


@router.post(
    "/login",
    response_model=ApiResponse[UserPublic],
    summary="Sign in with email and password",
)
async def login(
    request: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> JSONResponse:
    user_public = await login_user(db, request)

    token = create_session_token(user_public.id)
    response = JSONResponse(
        status_code=200,
        content=ApiResponse.ok(user_public).model_dump(mode="json"),
    )
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=SESSION_MAX_AGE_SECONDS,
        path="/",
    )
    return response


@router.post(
    "/logout",
    response_model=ApiResponse[None],
    summary="Sign out and clear session",
)
async def logout() -> JSONResponse:
    response = JSONResponse(
        status_code=200,
        content=ApiResponse.ok(None).model_dump(mode="json"),
    )
    response.delete_cookie(key=SESSION_COOKIE_NAME, path="/")
    return response


@router.get(
    "/me",
    response_model=ApiResponse[UserPublic],
    summary="Get the current authenticated user",
)
async def me(
    current_user: UserDocument | None = Depends(get_optional_user),
) -> JSONResponse:
    if current_user is None:
        return JSONResponse(
            status_code=200,
            content=ApiResponse.ok(None).model_dump(mode="json"),
        )
    user_public = _to_public(current_user)
    return JSONResponse(
        status_code=200,
        content=ApiResponse.ok(user_public).model_dump(mode="json"),
    )
