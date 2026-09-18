/**
 * Ascendia AI — HTTP client
 *
 * A thin fetch wrapper that:
 *   - Reads the base URL from NEXT_PUBLIC_API_URL
 *   - Normalizes errors into a consistent ApiResponse shape
 *   - Never exposes raw network errors to the UI
 */

import { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Perform a GET request and parse the JSON body as ApiResponse<T>.
 */
export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return (await response.json()) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      data: null,
      error: {
        code: "NETWORK_ERROR",
        message: "Unable to reach the server. Check your connection and try again.",
      },
    };
  }
}

/**
 * Perform a multipart/form-data POST request.
 * Intentionally does NOT set Content-Type — the browser sets the boundary automatically.
 */
export async function apiUpload<T>(path: string, formData: FormData): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok && response.status !== 422) {
      // Non-422 HTTP errors (500, 503, etc.) are server-level failures
      return {
        success: false,
        data: null,
        error: {
          code: "SERVER_ERROR",
          message: "The server encountered an error. Please try again.",
        },
      };
    }

    return (await response.json()) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      data: null,
      error: {
        code: "NETWORK_ERROR",
        message: "We couldn't upload your assessment. Check your connection and try again.",
      },
    };
  }
}
