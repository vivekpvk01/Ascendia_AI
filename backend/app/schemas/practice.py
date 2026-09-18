"""
Ascendia AI — Practice Question schemas

Pydantic request/response models for practice question endpoints.
PracticeQuestionPublic never exposes hidden test cases.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.practice_question import (
    Difficulty,
    QuestionStatus,
    QuestionVisibility,
    SampleTest,
    SourceType,
)


class PracticeQuestionCreate(BaseModel):
    title: str = Field(min_length=3, max_length=300)
    statement: str = Field(min_length=10)
    constraints: Optional[str] = None
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    sample_tests: list[SampleTest] = Field(default_factory=list, max_length=10)
    difficulty: Difficulty = Difficulty.MEDIUM
    topics: list[str] = Field(default_factory=list, max_length=10)
    # source_type and created_by are set server-side, not from request
    visibility: QuestionVisibility = QuestionVisibility.PRIVATE
    # status defaults to DRAFT; admin can explicitly set
    status: Optional[QuestionStatus] = None
    assessment_id: Optional[str] = None


class PracticeQuestionUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3, max_length=300)
    statement: Optional[str] = Field(default=None, min_length=10)
    constraints: Optional[str] = None
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    sample_tests: Optional[list[SampleTest]] = None
    difficulty: Optional[Difficulty] = None
    topics: Optional[list[str]] = None
    visibility: Optional[QuestionVisibility] = None
    status: Optional[QuestionStatus] = None


class PracticeQuestionPublic(BaseModel):
    """
    Safe representation of a PracticeQuestion returned to clients.
    NEVER includes hidden_tests.
    """
    id: str
    title: str
    statement: str
    constraints: Optional[str] = None
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    sample_tests: list[SampleTest]
    difficulty: Difficulty
    topics: list[str]
    source_type: SourceType
    created_by: str
    assessment_id: Optional[str] = None
    visibility: QuestionVisibility
    status: QuestionStatus
    created_at: datetime
    updated_at: datetime
