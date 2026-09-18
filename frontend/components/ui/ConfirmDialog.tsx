"use client";

/**
 * Ascendia AI — ConfirmDialog component
 * Accessible modal for confirming destructive actions.
 */

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
      };
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white border border-[#e2e8f0] rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] p-6">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#475569] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8] rounded"
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-[#b91c1c]" aria-hidden="true" />
          </div>
          <div>
            <h2 id="confirm-dialog-title" className="text-sm font-semibold text-[#0f172a]">
              {title}
            </h2>
            <p className="text-sm text-[#64748b] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed outline-none bg-transparent text-[#475569] border border-transparent hover:bg-[#f1f5f9] hover:text-[#0f172a] focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2 h-8 px-3 text-sm gap-1.5"
          >
            {cancelLabel}
          </button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {isLoading ? "Deleting…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
