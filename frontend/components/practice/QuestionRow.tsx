/**
 * Ascendia AI — QuestionRow component
 * A single row in the practice question list table.
 */

import Link from "next/link";
import { Lock, Globe, FileText, User, BookOpen } from "lucide-react";
import { DifficultyBadge } from "@/components/practice/DifficultyBadge";
import { Badge } from "@/components/ui/Badge";
import { PracticeQuestion, SourceType } from "@/types/practice";

interface QuestionRowProps {
  question: PracticeQuestion;
  currentUserId?: string;
}

const sourceIcons: Record<SourceType, React.ElementType> = {
  assessment: FileText,
  admin: BookOpen,
  user: User,
};

const sourceLabels: Record<SourceType, string> = {
  assessment: "Assessment",
  admin: "Curated",
  user: "Personal",
};

const statusVariant = {
  draft: "neutral" as const,
  published: "success" as const,
  archived: "warning" as const,
};

export function QuestionRow({ question, currentUserId }: QuestionRowProps) {
  const SourceIcon = sourceIcons[question.source_type];
  const isOwner = question.created_by === currentUserId;

  return (
    <Link
      href={`/practice/${question.id}`}
      className="group flex items-center gap-4 px-6 py-4 border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1d4ed8]"
    >
      {/* Title + tags */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0f172a] group-hover:text-[#1d4ed8] transition-colors truncate">
          {question.title}
        </p>
        {question.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {question.topics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs text-[#64748b] bg-[#f1f5f9] px-1.5 py-0.5 rounded"
              >
                {t}
              </span>
            ))}
            {question.topics.length > 3 && (
              <span className="text-xs text-[#94a3b8]">+{question.topics.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Difficulty */}
      <div className="shrink-0 hidden sm:block">
        <DifficultyBadge difficulty={question.difficulty} />
      </div>

      {/* Source */}
      <div className="shrink-0 hidden md:flex items-center gap-1.5 text-xs text-[#64748b]">
        <SourceIcon size={13} aria-hidden="true" />
        {sourceLabels[question.source_type]}
      </div>

      {/* Status (only for own questions or admin) */}
      {isOwner && (
        <div className="shrink-0 hidden md:block">
          <Badge variant={statusVariant[question.status]}>
            {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
          </Badge>
        </div>
      )}

      {/* Visibility icon */}
      <div className="shrink-0 text-[#94a3b8]" title={question.visibility === "private" ? "Private" : "Public"}>
        {question.visibility === "private" ? (
          <Lock size={14} aria-label="Private" />
        ) : (
          <Globe size={14} aria-label="Public" />
        )}
      </div>
    </Link>
  );
}
