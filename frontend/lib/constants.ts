/**
 * Ascendia AI — Application constants
 *
 * Centralised configuration values used across the frontend.
 * Never hardcode these inline — always reference from here.
 */

/** Maximum allowed upload file size in megabytes (must match backend config). */
export const MAX_FILE_SIZE_MB = 10;

/** Derived byte limit for client-side validation. */
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/** Supported file extensions for assessment upload. */
export const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".png", ".jpg", ".jpeg", ".txt"] as const;

/** Human-readable label for the upload format list. */
export const SUPPORTED_FORMAT_LABELS = ["PDF", "DOCX", "PNG", "JPG", "TXT"];

/** MIME types that the file input accept attribute should allow. */
export const ACCEPTED_MIME_TYPES =
  "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,text/plain";

/** Application navigation items (used by Sidebar). */
export const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Assessments", href: "/assessments", icon: "FileText" },
  { label: "Practice", href: "/practice", icon: "Code2" },
  { label: "Submissions", href: "/submissions", icon: "CheckSquare" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
