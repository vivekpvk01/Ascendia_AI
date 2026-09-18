/**
 * Ascendia AI — Auth API calls
 */

import { apiGet, apiPost } from "@/lib/api/client";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<User>> {
  return apiPost<User>("/api/v1/auth/signup", { name, email, password });
}

export async function login(
  email: string,
  password: string
): Promise<ApiResponse<User>> {
  return apiPost<User>("/api/v1/auth/login", { email, password });
}

export async function logout(): Promise<ApiResponse<null>> {
  return apiPost<null>("/api/v1/auth/logout", {});
}

export async function getMe(): Promise<ApiResponse<User | null>> {
  return apiGet<User | null>("/api/v1/auth/me");
}
