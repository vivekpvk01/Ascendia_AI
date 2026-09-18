/**
 * Ascendia AI — User types
 */

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string; // ISO 8601
}
