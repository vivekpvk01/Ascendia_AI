"""
Ascendia AI — Pipeline Interfaces (Phase 2 stub)

These abstract base classes define the contracts for each stage
of the assessment transpilation pipeline.

Implement these in Phase 2 when integrating OCR and LLM components.
The backend assessment_service.py is designed to call into these interfaces.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass
class DocumentInput:
    """Raw document provided to the pipeline."""

    upload_id: str
    file_path: str
    file_type: str  # 'pdf' | 'docx' | 'png' | 'jpg' | 'txt'


@dataclass
class ExtractedText:
    """Raw text extracted from a document."""

    upload_id: str
    text: str
    pages: int | None = None
    confidence: float | None = None  # OCR confidence if applicable


@dataclass
class StructuredProblem:
    """A coding problem extracted and structured from assessment text."""

    title: str
    statement: str
    constraints: str
    input_format: str
    output_format: str
    sample_inputs: list[str]
    sample_outputs: list[str]
    raw_source: str


class DocumentExtractor(ABC):
    """
    Stage 1: Extract raw text from an uploaded document.
    Implementations: PDF parser, DOCX parser, Tesseract OCR, etc.
    """

    @abstractmethod
    async def extract(self, document: DocumentInput) -> ExtractedText:
        """Extract text content from the provided document."""
        ...


class ProblemParser(ABC):
    """
    Stage 2: Parse extracted text into structured problems using an LLM.
    """

    @abstractmethod
    async def parse(self, text: ExtractedText) -> list[StructuredProblem]:
        """Parse raw text into a list of structured coding problems."""
        ...


class TestCaseGenerator(ABC):
    """
    Stage 3 (Phase 3): Generate test cases for a structured problem.
    """

    @abstractmethod
    async def generate(self, problem: StructuredProblem) -> list[dict[str, Any]]:
        """Generate test cases (input/expected output pairs) for a problem."""
        ...
