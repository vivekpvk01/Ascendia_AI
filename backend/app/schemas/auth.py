"""
Ascendia AI — Auth schemas

Pydantic request/response models for authentication endpoints.
UserPublic deliberately omits hashed_password and other sensitive fields.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserPublic(BaseModel):
    """Safe user representation returned to clients. Never includes hashed_password."""
    id: str
    name: str
    email: str
    role: str
    created_at: datetime
