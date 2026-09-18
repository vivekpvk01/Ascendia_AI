/**
 * Ascendia AI — FilePreview
 *
 * Displays metadata for a selected file before / after upload.
 * Shows: icon, name, type badge, size, and a remove action.
 */

import { FileText, Image as ImageIcon, File, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatFileSize, getFileTypeLabel } from "@/lib/validation/fileValidation";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

function FileIcon({ extension }: { extension: string }) {
  const ext = extension.toLowerCase();
  if (["png", "jpg", "jpeg"].includes(ext)) {
    return <ImageIcon size={18} className="text-[#0369a1]" aria-hidden="true" />;
  }
  if (["pdf", "docx", "txt"].includes(ext)) {
    return <FileText size={18} className="text-[#1d4ed8]" aria-hidden="true" />;
  }
  return <File size={18} className="text-[#64748b]" aria-hidden="true" />;
}

export function FilePreview({ file, onRemove, disabled = false }: FilePreviewProps) {
  const extension = file.name.split(".").pop() ?? "";
  const typeLabel = getFileTypeLabel(file.name);

  return (
    <div className="flex items-center gap-3 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
      {/* File type icon */}
      <div className="flex items-center justify-center w-9 h-9 bg-white border border-[#e2e8f0] rounded-md shrink-0">
        <FileIcon extension={extension} />
      </div>

      {/* File metadata */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium text-[#0f172a] truncate"
          title={file.name}
        >
          {file.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="neutral">{typeLabel}</Badge>
          <span className="text-xs text-[#94a3b8]">{formatFileSize(file.size)}</span>
        </div>
      </div>

      {/* Remove action */}
      <button
        onClick={onRemove}
        disabled={disabled}
        className="flex items-center justify-center w-7 h-7 rounded-md text-[#94a3b8] hover:text-[#b91c1c] hover:bg-[#fef2f2] transition-colors duration-100 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={`Remove ${file.name}`}
        title="Remove file"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
