"""
Ascendia AI — User domain model

MongoDB document model for User.
Never expose hashed_password in any API response.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    STUDENT = "student"
    ADMIN = "admin"


class UserDocument(BaseModel):
    """
    Represents a User document in MongoDB.
    _id is managed by Motor/MongoDB; we surface it as `id` in responses.
    """

    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    hashed_password: str
    role: UserRole = UserRole.STUDENT
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {"populate_by_name": True}
