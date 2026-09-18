/**
 * Ascendia AI — HTTP client
 *
 * A thin fetch wrapper that:
 *   - Reads the base URL from NEXT_PUBLIC_API_URL
 *   - Sends credentials (cookies) automatically with every request
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
      credentials: "include",
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
 * Perform a JSON POST request.
 */
export async function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await response.json()) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      data: null,
      error: { code: "NETWORK_ERROR", message: "Unable to reach the server." },
    };
  }
}

/**
 * Perform a JSON PATCH request.
 */
export async function apiPatch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await response.json()) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      data: null,
      error: { code: "NETWORK_ERROR", message: "Unable to reach the server." },
    };
  }
}

/**
 * Perform a DELETE request.
 */
export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      credentials: "include",
    });
    return (await response.json()) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      data: null,
      error: { code: "NETWORK_ERROR", message: "Unable to reach the server." },
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
      credentials: "include",
      body: formData,
    });

    if (!response.ok && response.status !== 422) {
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
