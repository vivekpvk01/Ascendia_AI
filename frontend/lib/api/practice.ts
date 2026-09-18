/**
 * Ascendia AI — Practice API calls
 */

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { ApiResponse } from "@/types/api";
import {
  PracticeQuestion,
  PracticeQuestionCreate,
  PracticeQuestionUpdate,
} from "@/types/practice";

export async function listQuestions(params?: {
  difficulty?: string;
  topic?: string;
  source_type?: string;
}): Promise<ApiResponse<PracticeQuestion[]>> {
  const query = new URLSearchParams();
  if (params?.difficulty) query.set("difficulty", params.difficulty);
  if (params?.topic) query.set("topic", params.topic);
  if (params?.source_type) query.set("source_type", params.source_type);
  const qs = query.toString();
  return apiGet<PracticeQuestion[]>(`/api/v1/practice${qs ? `?${qs}` : ""}`);
}

export async function getQuestion(id: string): Promise<ApiResponse<PracticeQuestion>> {
  return apiGet<PracticeQuestion>(`/api/v1/practice/${id}`);
}

export async function createQuestion(
  data: PracticeQuestionCreate
): Promise<ApiResponse<PracticeQuestion>> {
  return apiPost<PracticeQuestion>("/api/v1/practice", data);
}

export async function updateQuestion(
  id: string,
  data: PracticeQuestionUpdate
): Promise<ApiResponse<PracticeQuestion>> {
  return apiPatch<PracticeQuestion>(`/api/v1/practice/${id}`, data);
}

export async function deleteQuestion(id: string): Promise<ApiResponse<null>> {
  return apiDelete<null>(`/api/v1/practice/${id}`);
}
