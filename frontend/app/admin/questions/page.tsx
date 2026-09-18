"use client";

/**
 * Ascendia AI — Admin Question Management page
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DifficultyBadge } from "@/components/practice/DifficultyBadge";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { apiDelete, apiGet } from "@/lib/api/client";
import { PracticeQuestion } from "@/types/practice";
import { ApiResponse } from "@/types/api";

const statusVariant = {
  draft: "neutral" as const,
  published: "success" as const,
  archived: "warning" as const,
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadQuestions = async () => {
    const result = await apiGet<PracticeQuestion[]>("/api/v1/admin/questions");
    if (result.success && result.data) {
      setQuestions(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => { loadQuestions(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await apiDelete(`/api/v1/admin/questions/${deleteId}`);
    setDeleteId(null);
    setIsDeleting(false);
    await loadQuestions();
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] transition-colors mb-4">
            <ArrowLeft size={14} />
            Admin
          </Link>
          <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Practice Questions</h1>
          <p className="text-[#64748b] text-sm mt-1">Manage all curated practice questions.</p>
        </div>
        <div className="shrink-0">
          <Link href="/admin/questions/new">
            <Button variant="primary" size="md" leftIcon={<Plus size={14} />}>
              New Question
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : questions.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <p className="text-sm font-medium text-[#0f172a] mb-1">No questions yet</p>
            <p className="text-sm text-[#64748b] mb-4">Create your first curated practice question.</p>
            <Link href="/admin/questions/new">
              <Button variant="primary" size="sm">Create Question</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="border border-[#e2e8f0] rounded-lg bg-white overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wide">Title</span>
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wide hidden sm:block">Difficulty</span>
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wide hidden md:block">Status</span>
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wide hidden md:block">Visibility</span>
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wide">Actions</span>
          </div>
          {questions.map((q) => (
            <div
              key={q.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors"
            >
              <div className="min-w-0">
                <Link href={`/practice/${q.id}`} className="text-sm font-medium text-[#0f172a] hover:text-[#1d4ed8] transition-colors truncate block">
                  {q.title}
                </Link>
                <p className="text-xs text-[#94a3b8] mt-0.5">{q.topics.slice(0, 3).join(", ")}</p>
              </div>
              <div className="shrink-0 hidden sm:block">
                <DifficultyBadge difficulty={q.difficulty} />
              </div>
              <div className="shrink-0 hidden md:block">
                <Badge variant={statusVariant[q.status]}>
                  {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                </Badge>
              </div>
              <div className="shrink-0 hidden md:block">
                <Badge variant={q.visibility === "public" ? "info" : "neutral"}>
                  {q.visibility.charAt(0).toUpperCase() + q.visibility.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/admin/questions/${q.id}`}>
                  <button className="text-[#94a3b8] hover:text-[#1d4ed8] transition-colors p-1" title="Edit">
                    <Edit2 size={14} />
                  </button>
                </Link>
                <button
                  className="text-[#94a3b8] hover:text-[#b91c1c] transition-colors p-1"
                  title="Delete"
                  onClick={() => setDeleteId(q.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </AppShell>
  );
}
