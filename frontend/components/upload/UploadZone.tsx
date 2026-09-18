"use client";

/**
 * Ascendia AI — UploadZone
 *
 * Drag-and-drop + click-to-browse file selection area.
 *
 * States:
 *   idle        — initial state, shows instructions
 *   drag-over   — file is being dragged over the drop area
 *   selected    — file has been chosen (shows FilePreview)
 *
 * Accessibility:
 *   - Hidden file input triggered by visible button
 *   - Keyboard-operable (Enter/Space activates the picker)
 *   - Drag-over state communicated via aria-live region
 *   - aria-describedby ties the drop area to instructions
 */

import React, { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { validateFile } from "@/lib/validation/fileValidation";
import { ACCEPTED_MIME_TYPES, SUPPORTED_FORMAT_LABELS, MAX_FILE_SIZE_MB } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onValidationError: (message: string) => void;
  disabled?: boolean;
}

export function UploadZone({ onFileSelect, onValidationError, disabled = false }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const result = validateFile(file);
      if (!result.valid) {
        onValidationError(result.errorMessage ?? "Invalid file.");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect, onValidationError],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected after removal
    if (inputRef.current) inputRef.current.value = "";
  };

  const openFilePicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Upload assessment file. Press Enter or Space to open file picker."
      aria-describedby="upload-zone-instructions"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      onClick={openFilePicker}
      className={[
        "relative flex flex-col items-center justify-center",
        "min-h-[220px] rounded-lg border-2 border-dashed",
        "transition-all duration-150 cursor-pointer select-none outline-none",
        isDragging
          ? "border-[#1d4ed8] bg-[#eff6ff]"
          : "border-[#cbd5e1] bg-[#f8fafc] hover:border-[#94a3b8] hover:bg-white",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        "focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME_TYPES}
        onChange={handleInputChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
      />

      {/* Upload icon */}
      <div
        className={[
          "flex items-center justify-center w-12 h-12 rounded-xl mb-4",
          "border transition-colors duration-150",
          isDragging
            ? "bg-[#dbeafe] border-[#bfdbfe]"
            : "bg-white border-[#e2e8f0]",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        <UploadCloud
          size={22}
          className={isDragging ? "text-[#1d4ed8]" : "text-[#64748b]"}
        />
      </div>

      {/* Instructions */}
      <div id="upload-zone-instructions" className="text-center px-6">
        {isDragging ? (
          <p className="text-[#1d4ed8] font-medium text-sm">
            Release to upload
          </p>
        ) : (
          <>
            <p className="text-[#0f172a] font-medium text-sm mb-1">
              Drag and drop your file here
            </p>
            <p className="text-[#64748b] text-sm mb-4">
              or
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
              tabIndex={-1}
              aria-hidden="true"
            >
              Choose a file
            </Button>
          </>
        )}
      </div>

      {/* Format info */}
      <p className="absolute bottom-4 text-[#94a3b8] text-xs text-center px-4">
        {SUPPORTED_FORMAT_LABELS.join(" · ")} &nbsp;·&nbsp; Max {MAX_FILE_SIZE_MB} MB
      </p>

      {/* ARIA live region for drag state */}
      <div aria-live="polite" className="sr-only">
        {isDragging ? "File dragged over drop zone. Release to upload." : ""}
      </div>
    </div>
  );
}
