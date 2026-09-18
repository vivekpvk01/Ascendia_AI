"""
Ascendia AI — PracticeQuestion domain model

MongoDB document model for PracticeQuestion.
The full model is defined here; the API layer exposes only safe subsets.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class SourceType(str, Enum):
    ASSESSMENT = "assessment"
    ADMIN = "admin"
    USER = "user"


class QuestionStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class QuestionVisibility(str, Enum):
    PRIVATE = "private"
    PUBLIC = "public"


class SampleTest(BaseModel):
    """A visible sample test case (input/output pair shown to students)."""
    input: str
    output: str
    explanation: Optional[str] = None


class PracticeQuestionDocument(BaseModel):
    """
    Full PracticeQuestion document as stored in MongoDB.

    NEVER expose hidden_tests to clients.
    The API schemas deliberately omit it.
    """

    id: Optional[str] = Field(default=None, alias="_id")
    title: str
    statement: str
    constraints: Optional[str] = None
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    sample_tests: list[SampleTest] = Field(default_factory=list)
    # hidden_tests: list[dict] — intentionally NOT in this model surface;
    # future field managed server-side only, never queried to clients.

    difficulty: Difficulty = Difficulty.MEDIUM
    topics: list[str] = Field(default_factory=list)

    source_type: SourceType = SourceType.USER
    created_by: str  # User ID
    assessment_id: Optional[str] = None  # Link to originating Assessment

    visibility: QuestionVisibility = QuestionVisibility.PRIVATE
    status: QuestionStatus = QuestionStatus.DRAFT

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {"populate_by_name": True}
