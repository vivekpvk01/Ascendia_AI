/**
 * Ascendia AI — Client-side file validation
 *
 * These checks provide immediate feedback to the user.
 * The backend ALWAYS validates independently — never trust frontend validation alone.
 */

import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, SUPPORTED_EXTENSIONS } from "@/lib/constants";

export interface FileValidationResult {
  valid: boolean;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Validate a File object before sending it to the API.
 *
 * Checks (in order):
 *   1. File is present
 *   2. Extension is in the supported list
 *   3. Size is within the configured limit
 *
 * Note: MIME sniffing (reading magic bytes) is intentionally omitted on the
 * client — the browser cannot reliably do this safely, and the backend handles it.
 */
export function validateFile(file: File): FileValidationResult {
  if (!file) {
    return {
      valid: false,
      errorCode: "MISSING_FILE",
      errorMessage: "No file selected.",
    };
  }

  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;

  if (!SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number])) {
    return {
      valid: false,
      errorCode: "UNSUPPORTED_FILE_TYPE",
      errorMessage: `Unsupported file type. Please upload a PDF, DOCX, PNG, JPG, or TXT file.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      errorCode: "FILE_TOO_LARGE",
      errorMessage: `File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      errorCode: "EMPTY_FILE",
      errorMessage: "The selected file is empty.",
    };
  }

  return { valid: true };
}

/**
 * Format a byte count as a human-readable string.
 * Examples: "2.4 KB", "1.1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Return the uppercase extension label for a filename.
 * "assessment.pdf" → "PDF"
 */
export function getFileTypeLabel(filename: string): string {
  return filename.split(".").pop()?.toUpperCase() ?? "FILE";
}
