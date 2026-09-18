/**
 * Ascendia AI — Assessment domain types
 *
 * These interfaces represent the current and planned data model.
 * Phase 1 implements UploadedFile; future phases will flesh out
 * Assessment, Problem, TestCase, and Submission.
 */

// ── Upload ────────────────────────────────────────────────────────────────────

export type UploadStatus = "uploaded" | "processing" | "ready" | "failed";

export interface UploadedFile {
  upload_id: string;
  filename: string;
  file_type: string;
  file_size: number;
  status: UploadStatus;
}

// ── Assessment ────────────────────────────────────────────────────────────────

export interface Assessment {
  id: string;
  title: string;
  sourceFile: UploadedFile;
  questions: Problem[];
  duration: number | null; // minutes, null if unset
  createdAt: string; // ISO 8601
}

// ── Problem ───────────────────────────────────────────────────────────────────

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Problem {
  id: string;
  title: string;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  sampleTests: TestCase[];
  // Hidden test cases are managed server-side — never exposed to the client
}

// ── Submission ────────────────────────────────────────────────────────────────

export type SubmissionStatus =
  | "pending"
  | "running"
  | "accepted"
  | "wrong_answer"
  | "time_limit_exceeded"
  | "runtime_error"
  | "compilation_error";

export interface Submission {
  id: string;
  problemId: string;
  userId: string;
  language: string;
  status: SubmissionStatus;
  submittedAt: string; // ISO 8601
}

// ── User ──────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
