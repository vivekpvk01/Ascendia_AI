"""
Ascendia AI — Auth Service

Business logic for signup and login.
This layer is the only place that calls the user repository for auth operations.
"""

import logging

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import hash_password, verify_password
from app.models.user import UserDocument, UserRole
from app.repositories.user_repository import create_user, find_user_by_email
from app.schemas.auth import LoginRequest, SignupRequest, UserPublic

logger = logging.getLogger(__name__)


async def signup_user(db: AsyncIOMotorDatabase, request: SignupRequest) -> UserPublic:
    """
    Create a new user account.

    Rules:
    - Email must not already be registered.
    - Password is hashed before storage.
    - New users always receive the 'student' role — never trust client-provided roles.
    """
    existing = await find_user_by_email(db, request.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    hashed = hash_password(request.password)
    user = UserDocument(
        name=request.name.strip(),
        email=request.email.lower().strip(),
        hashed_password=hashed,
        role=UserRole.STUDENT,  # Always student on signup
    )
    created = await create_user(db, user)
    logger.info("New user signed up. user_id=%s email=%s", created.id, created.email)
    return _to_public(created)


async def login_user(db: AsyncIOMotorDatabase, request: LoginRequest) -> UserPublic:
    """
    Authenticate a user by email and password.

    Returns UserPublic on success.
    Raises HTTP 401 with a generic message on failure —
    never reveal whether email exists or not.
    """
    user = await find_user_by_email(db, request.email)
    if user is None or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    logger.info("User logged in. user_id=%s", user.id)
    return _to_public(user)


def _to_public(user: UserDocument) -> UserPublic:
    """Convert UserDocument to the safe public response (no password)."""
    return UserPublic(
        id=user.id or "",
        name=user.name,
        email=str(user.email),
        role=user.role.value,
        created_at=user.created_at,
    )
