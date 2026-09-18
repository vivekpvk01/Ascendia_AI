"""
Ascendia AI — Authentication dependencies

FastAPI dependencies for verifying authenticated users and admin roles.
Used via Depends() in route handlers.

Example:
    current_user: UserDocument = Depends(get_current_user)
    admin_user: UserDocument = Depends(require_admin)
"""

import logging
from typing import Optional

from fastapi import Cookie, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_db
from app.core.security import SESSION_COOKIE_NAME, decode_session_token
from app.models.user import UserDocument, UserRole
from app.repositories.user_repository import find_user_by_id

logger = logging.getLogger(__name__)


async def get_optional_user(
    ascendia_session: Optional[str] = Cookie(default=None, alias=SESSION_COOKIE_NAME),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> Optional[UserDocument]:
    """
    Return the current user if a valid session cookie is present.
    Returns None if unauthenticated — does NOT raise an exception.
    """
    if not ascendia_session:
        return None

    user_id = decode_session_token(ascendia_session)
    if not user_id:
        return None

    user = await find_user_by_id(db, user_id)
    return user


async def get_current_user(
    user: Optional[UserDocument] = Depends(get_optional_user),
) -> UserDocument:
    """
    Require an authenticated user.
    Raises HTTP 401 if no valid session cookie is present.
    """
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in.",
        )
    return user


async def require_admin(
    user: UserDocument = Depends(get_current_user),
) -> UserDocument:
    """
    Require an authenticated admin user.
    Raises HTTP 403 if the user does not have the admin role.
    Role is always verified server-side from the database — never trusted from the client.
    """
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required.",
        )
    return user
