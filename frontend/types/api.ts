/**
 * Ascendia AI — API response types
 *
 * Mirrors the backend ApiResponse[T] envelope exactly.
 * All API calls return this structure.
 */

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}
