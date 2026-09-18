/**
 * Ascendia AI — Assessment API calls
 */

import { apiUpload } from "@/lib/api/client";
import { ApiResponse } from "@/types/api";
import { UploadedFile } from "@/types/assessment";

/**
 * Upload an assessment file to the backend.
 *
 * @param file - The File object selected by the user.
 * @returns ApiResponse containing UploadedFile metadata on success.
 */
export async function uploadAssessment(file: File): Promise<ApiResponse<UploadedFile>> {
  const formData = new FormData();
  formData.append("file", file);
  return apiUpload<UploadedFile>("/api/v1/assessments/upload", formData);
}
