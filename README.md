# Ascendia AI

> Transform assessments. Practice like the real thing.

Ascendia AI is an AI-driven pipeline for assessment transpilation — converting unstructured placement assessment material (PDFs, DOCX, images, screenshots) into interactive, structured coding practice sessions.

This repository contains the Phase 1 foundation: the production-quality product shell and assessment upload workflow.

---

## Overview

University students preparing for technical placements commonly practice on platforms like LeetCode and HackerRank, but company-specific recruitment assessments have different formats, constraints, and question styles. Placement material is often shared as PDFs, DOCX files, or screenshots with no structured practice interface.

Ascendia AI addresses this gap by providing an engineering-grade pipeline that transforms raw assessment documents into interactive coding challenges with AI-assisted problem extraction, test generation, and evaluation.

---

## Problem

- Placement assessment material exists in unstructured formats (PDF, DOCX, images)
- No existing platform converts company-specific assessments into practice environments
- Students lack a systematic way to practice under conditions that mirror actual company tests
- Assessment creators have no tool to author and validate test cases against real code submissions

---

## Solution

Ascendia AI provides:

1. **Assessment Ingestion** — Upload PDFs, DOCX, images, or text files containing assessment material
2. **AI Problem Extraction** *(Phase 2)* — Extract structured coding problems using LLMs
3. **Interactive Practice** *(Phase 3)* — Practice problems with a code editor and multi-language execution
4. **Evaluation & Feedback** *(Phase 3)* — Automatic test case validation and structured feedback

---

## Current Phase

**Phase 1 — Product Foundation + Assessment Ingestion**

Delivered in Phase 1:

- [x] Application shell (sidebar, top bar, routing)
- [x] Dashboard with meaningful empty states
- [x] Assessments page
- [x] Upload Assessment page with complete upload workflow
- [x] File validation (client-side + backend, independent)
- [x] All upload states: idle → uploading → success / error
- [x] FastAPI backend with health check and upload endpoint
- [x] Consistent `ApiResponse<T>` envelope
- [x] Security: UUID-based storage, MIME sniffing, no path exposure
- [x] 13 backend tests passing

NOT in Phase 1 (intentionally deferred):

- AI/OCR pipeline
- Code editor or execution
- MongoDB persistence
- Hidden test generation
- Performance analytics
- Proctoring or plagiarism detection

---

## Architecture

```
ascendia-ai/
├── frontend/          Next.js 16 (App Router) + TypeScript + Tailwind CSS
├── backend/           FastAPI + Python 3.13 + Pydantic v2
├── ai/                AI pipeline interfaces (Phase 2 stub)
├── .env               Root environment configuration
└── .gitignore
```

### Backend Architecture

```
backend/
  app/
    main.py                     Application factory, CORS, lifespan
    api/v1/
      router.py                 API v1 router aggregator
      routes/
        health.py               GET /api/v1/health
        assessments.py          POST /api/v1/assessments/upload
    schemas/
      common.py                 ApiResponse[T] envelope
      assessment.py             Upload request/response schemas
    services/
      assessment_service.py     Orchestrates ingestion pipeline
      file_service.py           Validation, MIME sniffing, UUID storage
    core/
      config.py                 Pydantic Settings v2
      logging.py                Structured logging setup
    utils/
      id.py                     UUID generation
  tests/
    conftest.py
    test_health.py
    test_upload.py
  uploads/                      Local file storage (gitignored)
  requirements.txt
  pytest.ini
```

### Frontend Architecture

```
frontend/
  app/
    layout.tsx                  Root layout (Inter font, metadata)
    page.tsx                    Redirect → /dashboard
    dashboard/page.tsx
    assessments/page.tsx
    assessments/new/page.tsx    Upload workflow (primary Phase 1 screen)
    practice/page.tsx
    submissions/page.tsx
    settings/page.tsx
  components/
    layout/
      AppShell.tsx
      Sidebar.tsx
      TopBar.tsx
    upload/
      UploadZone.tsx
      FilePreview.tsx
      UploadStatus.tsx
    ui/
      Button.tsx
      Badge.tsx
      Card.tsx
      EmptyState.tsx
      Spinner.tsx
  lib/
    api/
      client.ts                 Fetch wrapper with error normalization
      assessments.ts            uploadAssessment() API call
    validation/
      fileValidation.ts         Client-side file validation
    constants.ts                Supported formats, size limits, nav items
  types/
    api.ts                      ApiResponse<T> type
    assessment.ts               Assessment domain types
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16 (App Router) |
| Frontend language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Backend framework | FastAPI 0.115 |
| Backend language | Python 3.13 |
| Validation | Pydantic v2 |
| File type detection | `filetype` (magic bytes) |
| Testing (backend) | pytest + pytest-asyncio |
| Database | MongoDB (stubbed for Phase 1) |

---

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment in .env if needed

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive docs (development only): `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Environment Variables

### Root `.env` / Backend `.env`

| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ascendia` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:3000` |
| `MAX_UPLOAD_SIZE_MB` | Maximum upload file size in MB | `10` |
| `UPLOAD_DIR` | Local upload storage directory | `uploads` |
| `APP_ENV` | Environment: `development` / `staging` / `production` | `development` |

### Frontend `.env.local`

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend | `http://localhost:8000` |

All environment variables are configured directly in `.env`.

---

## API

### `GET /api/v1/health`

```json
{
  "status": "ok",
  "version": "0.1.0",
  "environment": "development"
}
```

### `POST /api/v1/assessments/upload`

Multipart form upload with field `file`.

**Success (200):**
```json
{
  "success": true,
  "data": {
    "upload_id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "google_assessment.pdf",
    "file_type": "pdf",
    "file_size": 204800,
    "status": "uploaded"
  },
  "error": null
}
```

**Validation Error (422):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "UNSUPPORTED_FILE_TYPE",
    "message": "Please upload a supported format: PDF, DOCX, PNG, JPG, TXT."
  }
}
```

Error codes: `MISSING_FILENAME`, `UNSUPPORTED_FILE_TYPE`, `EMPTY_FILE`, `FILE_TOO_LARGE`, `CONTENT_TYPE_MISMATCH`, `STORAGE_ERROR`, `INTERNAL_ERROR`

---

## Testing

### Backend

```bash
cd backend
.\venv\Scripts\activate  # Windows
pytest tests/ -v
```

13 tests covering:
- Health endpoint (status, structure, value)
- Upload: PDF, TXT, PNG accepted
- Upload: unsupported extension rejected
- Upload: empty file rejected
- Upload: missing file field rejected
- ApiResponse envelope on success and error
- Upload ID uniqueness across requests

### Frontend

TypeScript and ESLint are the primary quality gates in Phase 1.

```bash
cd frontend
npm run type-check   # TypeScript — 0 errors
npm run lint         # ESLint — 0 errors, 0 warnings
npm run build        # Production build — all routes compiled
```

---

## Security Notes

- Uploaded files are stored under UUID-based filenames — original filenames are never used as storage keys
- MIME type is verified via magic byte sniffing (independent of client-supplied `Content-Type`)
- Internal file paths are never exposed in API responses
- Stack traces never reach clients — the global exception handler maps all errors to generic messages
- Secrets are managed via environment variables — no hardcoded values
- `.env` and `.env.local` are gitignored

---

## Future Roadmap

### Phase 2 — AI Extraction Pipeline
- OCR for image/PDF inputs (Tesseract / AWS Textract)
- LLM-based problem extraction and structuring
- Structured problem representation in MongoDB
- Assessment management UI (list, detail, edit)

### Phase 3 — Code Execution & Evaluation
- Monaco editor integration
- Multi-language code execution (Judge0 / self-hosted)
- Hidden test case generation and validation
- Submission history and evaluation results

### Phase 4 — Platform Features
- User authentication and authorization
- Company-specific assessment libraries
- Performance analytics and progress tracking
- Recruiter/admin portal
- API for institutional integrations

---

## Contributing

This is a university major project. Code quality is held to professional SDE standards.

All changes require:
- TypeScript strict mode compliance
- ESLint passing (0 errors)
- Backend tests passing
- No secrets committed
- No fake functionality

---

*Ascendia AI — built with engineering discipline.*
