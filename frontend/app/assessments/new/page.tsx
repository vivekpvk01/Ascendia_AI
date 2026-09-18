"use client";

/**
 * Ascendia AI — Upload Assessment page
 *
 * The primary Phase 1 workflow. Handles the complete upload flow:
 * idle → file-selected → uploading → processing → success/error
 *
 * This component orchestrates state; visual rendering is delegated
 * to UploadZone, FilePreview, and UploadStatus.
 */

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UploadZone } from "@/components/upload/UploadZone";
import { FilePreview } from "@/components/upload/FilePreview";
import { UploadStatus, UploadState } from "@/components/upload/UploadStatus";
import { uploadAssessment } from "@/lib/api/assessments";

type PageState = "idle" | "selected" | "uploading" | "done";

export default function UploadAssessmentPage() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setValidationError(null);
    setUploadState({ status: "idle" });
    setPageState("selected");
  }, []);

  const handleValidationError = useCallback((message: string) => {
    setValidationError(message);
    setSelectedFile(null);
    setPageState("idle");
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setValidationError(null);
    setUploadState({ status: "idle" });
    setPageState("idle");
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setPageState("uploading");
    setUploadState({ status: "uploading" });

    const result = await uploadAssessment(selectedFile);

    if (result.success && result.data) {
      setUploadState({ status: "success", data: result.data });
      setPageState("done");
    } else {
      const message =
        result.error?.message ??
        "We couldn't upload your assessment right now. Please try again.";
      setUploadState({ status: "error", message });
      setPageState("selected"); // Allow retry
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setValidationError(null);
    setUploadState({ status: "idle" });
    setPageState("idle");
  };

  const isUploading = pageState === "uploading";
  const isDone = pageState === "done";

  return (
    <AppShell>
      {/* Page header */}
      <div className="mb-8">
        <Link
          href="/assessments"
          className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] transition-colors mb-4 outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8] rounded"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Assessments
        </Link>
        <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
          Upload Assessment
        </h1>
        <p className="text-[#64748b] text-sm mt-1">
          Import a coding assessment and prepare it for interactive practice.
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardBody className="space-y-5">
            {/* Section heading */}
            <div>
              <h2 className="text-sm font-semibold text-[#0f172a] mb-0.5">
                Assessment file
              </h2>
              <p className="text-xs text-[#64748b]">
                Upload a PDF, DOCX, image, or text file containing placement assessment questions.
              </p>
            </div>

            {/* Upload zone — hidden when file is selected */}
            {!selectedFile && (
              <UploadZone
                onFileSelect={handleFileSelect}
                onValidationError={handleValidationError}
                disabled={isUploading}
              />
            )}

            {/* Validation error */}
            {validationError && (
              <div
                role="alert"
                className="flex items-start gap-3 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg"
              >
                <AlertCircle
                  size={16}
                  className="text-[#b91c1c] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-sm text-[#b91c1c]">{validationError}</p>
              </div>
            )}

            {/* Selected file preview */}
            {selectedFile && (
              <FilePreview
                file={selectedFile}
                onRemove={handleRemoveFile}
                disabled={isUploading}
              />
            )}

            {/* Upload status */}
            <UploadStatus state={uploadState} />

            {/* Actions */}
            {selectedFile && !isDone && (
              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleUpload}
                  isLoading={isUploading}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Assessment"}
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Post-success actions */}
            {isDone && (
              <div className="flex items-center gap-3 pt-1">
                <Button variant="secondary" size="md" onClick={handleReset}>
                  Upload another
                </Button>
                <Link href="/assessments">
                  <Button variant="ghost" size="md">
                    View Assessments
                  </Button>
                </Link>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Information panel */}
        <div className="mt-6 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
          <h3 className="text-sm font-semibold text-[#0f172a] mb-3">
            What happens after upload?
          </h3>
          <ol className="space-y-2">
            {[
              {
                step: "File stored",
                desc: "Your file is validated and stored securely under a randomized identifier.",
              },
              {
                step: "Processing pipeline",
                desc: "In a future release, the AI pipeline will extract problems from your document.",
              },
              {
                step: "Assessment ready",
                desc: "Problems will be structured and available for interactive practice.",
              },
            ].map(({ step, desc }, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#e2e8f0] text-[#475569] text-xs font-semibold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <span className="text-sm font-medium text-[#0f172a]">{step}</span>
                  <span className="text-sm text-[#64748b]"> — {desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </AppShell>
  );
}
