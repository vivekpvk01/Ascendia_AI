/**
 * Ascendia AI — UploadStatus
 *
 * Renders the current upload state with clear, honest messaging.
 *
 * States:
 *   idle        — nothing to show
 *   uploading   — indeterminate progress (no fake percentages)
 *   processing  — file received, backend is handling it
 *   success     — upload_id returned, file stored
 *   error       — validation or server error
 *
 * IMPORTANT: No fake progress percentages. Only honest state messaging.
 */

import { CheckCircle, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { UploadedFile } from "@/types/assessment";

export type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "processing" }
  | { status: "success"; data: UploadedFile }
  | { status: "error"; message: string };

interface UploadStatusProps {
  state: UploadState;
}

export function UploadStatus({ state }: UploadStatusProps) {
  if (state.status === "idle") return null;

  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {state.status === "uploading" && (
        <div className="flex items-center gap-3 p-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-lg">
          <Spinner size={16} label="Uploading assessment..." />
          <div>
            <p className="text-sm font-medium text-[#0369a1]">Uploading assessment...</p>
            <p className="text-xs text-[#64748b] mt-0.5">
              Please keep this page open.
            </p>
          </div>
        </div>
      )}

      {state.status === "processing" && (
        <div className="flex items-center gap-3 p-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-lg">
          <Spinner size={16} label="Preparing assessment..." />
          <div>
            <p className="text-sm font-medium text-[#0369a1]">Preparing your assessment...</p>
            <p className="text-xs text-[#64748b] mt-0.5">
              This may take a moment.
            </p>
          </div>
        </div>
      )}

      {state.status === "success" && (
        <div className="flex items-start gap-3 p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg">
          <CheckCircle size={18} className="text-[#15803d] mt-0.5 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#15803d]">
              Assessment uploaded successfully
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">
              File stored · ID:{" "}
              <code className="font-mono text-[#0f172a]">{state.data.upload_id}</code>
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">
              The AI processing pipeline will be connected in a future release.
            </p>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div className="flex items-start gap-3 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-lg">
          <XCircle size={18} className="text-[#b91c1c] mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-[#b91c1c]">Upload failed</p>
            <p className="text-xs text-[#64748b] mt-0.5">{state.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
