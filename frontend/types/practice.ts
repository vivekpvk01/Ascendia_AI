/**
 * Ascendia AI — Practice Question types
 */

export type Difficulty = "easy" | "medium" | "hard";
export type SourceType = "assessment" | "admin" | "user";
export type QuestionStatus = "draft" | "published" | "archived";
export type QuestionVisibility = "private" | "public";

export interface SampleTest {
  input: string;
  output: string;
  explanation?: string;
}

export interface PracticeQuestion {
  id: string;
  title: string;
  statement: string;
  constraints: string | null;
  input_format: string | null;
  output_format: string | null;
  sample_tests: SampleTest[];
  difficulty: Difficulty;
  topics: string[];
  source_type: SourceType;
  created_by: string;
  assessment_id: string | null;
  visibility: QuestionVisibility;
  status: QuestionStatus;
  created_at: string;
  updated_at: string;
}

export interface PracticeQuestionCreate {
  title: string;
  statement: string;
  constraints?: string;
  input_format?: string;
  output_format?: string;
  sample_tests?: SampleTest[];
  difficulty?: Difficulty;
  topics?: string[];
  visibility?: QuestionVisibility;
  assessment_id?: string;
}

export interface PracticeQuestionUpdate {
  title?: string;
  statement?: string;
  constraints?: string;
  input_format?: string;
  output_format?: string;
  sample_tests?: SampleTest[];
  difficulty?: Difficulty;
  topics?: string[];
  visibility?: QuestionVisibility;
  status?: QuestionStatus;
}
