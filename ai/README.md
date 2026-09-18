# Ascendia AI — Phase 2 AI Pipeline

This directory will contain the AI components of the assessment transpilation pipeline.

## Planned Pipeline

```
Document (PDF / DOCX / Image / Text)
    ↓
Document Processing  [Phase 2]
    ↓
OCR / Text Extraction  [Phase 2]
    ↓
AI Problem Understanding  [Phase 2]
    ↓
Structured Problem Representation
    ↓
Assessment Generation
    ↓
AI-Assisted Test Case Generation  [Phase 3]
    ↓
Hidden Test Validation  [Phase 3]
    ↓
Multi-Language Code Execution  [Phase 3]
    ↓
Evaluation + Intelligent Feedback  [Phase 3]
```

## Interfaces

Abstract interfaces for each pipeline stage are defined in `pipeline/interfaces.py`.
These define the expected input/output contracts so backend services can be connected
without modifying route or service code.

## Phase 1 Status

Phase 1 ends at file storage. The backend's `assessment_service.py` is designed to
call into this pipeline in a future phase — the extension point is explicitly
documented in the service code.
