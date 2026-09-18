"use client";

/**
 * Ascendia AI — Practice Question Detail page
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Lock, Globe } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DifficultyBadge } from "@/components/practice/DifficultyBadge";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { getQuestion, deleteQuestion } from "@/lib/api/practice";
import { useAuth } from "@/app/providers/AuthProvider";
import { PracticeQuestion } from "@/types/practice";

export default function PracticeQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    getQuestion(id).then((result) => {
      if (!mounted) return;
      if (result.success && result.data) {
        setQuestion(result.data);
      } else {
        setError(result.error?.message ?? "Question not found.");
      }
      setIsLoading(false);
    });
    return () => { mounted = false; };
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteQuestion(id);
    if (result.success) {
      router.push("/practice");
    } else {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const isOwner = question?.created_by === user?.id;
  const canEdit = isOwner || isAdmin;

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <Spinner size={24} />
        </div>
      </AppShell>
    );
  }

  if (error || !question) {
    return (
      <AppShell>
        <div className="mb-4">
          <Link href="/practice" className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
            <ArrowLeft size={14} />
            Back to Practice
          </Link>
        </div>
        <Card>
          <div className="flex items-center justify-center py-20 text-sm text-[#94a3b8]">
            {error ?? "Question not found."}
          </div>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/practice"
          className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Practice
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">{question.title}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <DifficultyBadge difficulty={question.difficulty} />
              {question.visibility === "private" ? (
                <Badge variant="neutral"><Lock size={10} className="mr-0.5" />Private</Badge>
              ) : (
                <Badge variant="info"><Globe size={10} className="mr-0.5" />Public</Badge>
              )}
              {question.topics.map((t) => (
                <span key={t} className="text-xs text-[#64748b] bg-[#f1f5f9] px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
          {canEdit && (
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/practice/${id}/edit`}>
                <Button variant="secondary" size="sm" leftIcon={<Edit2 size={13} />}>
                  Edit
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 size={13} />}
                onClick={() => setShowDelete(true)}
                className="text-[#64748b] hover:text-[#b91c1c] hover:bg-[#fef2f2]"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl space-y-5">
        {/* Problem Statement */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-[#0f172a]">Problem Statement</h2>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-[#0f172a] leading-relaxed whitespace-pre-wrap">{question.statement}</p>
          </CardBody>
        </Card>

        {/* Constraints */}
        {question.constraints && (
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-[#0f172a]">Constraints</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-wrap font-mono">{question.constraints}</p>
            </CardBody>
          </Card>
        )}

        {/* Input/Output Format */}
        {(question.input_format || question.output_format) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.input_format && (
              <Card>
                <CardHeader><h2 className="text-sm font-semibold text-[#0f172a]">Input Format</h2></CardHeader>
                <CardBody>
                  <p className="text-sm text-[#475569] whitespace-pre-wrap">{question.input_format}</p>
                </CardBody>
              </Card>
            )}
            {question.output_format && (
              <Card>
                <CardHeader><h2 className="text-sm font-semibold text-[#0f172a]">Output Format</h2></CardHeader>
                <CardBody>
                  <p className="text-sm text-[#475569] whitespace-pre-wrap">{question.output_format}</p>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* Sample Test Cases */}
        {question.sample_tests.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-[#0f172a]">Sample Test Cases</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {question.sample_tests.map((tc, i) => (
                <div key={i} className="border border-[#e2e8f0] rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <span className="text-xs font-semibold text-[#475569]">Case {i + 1}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#e2e8f0]">
                    <div className="p-4">
                      <p className="text-xs font-medium text-[#64748b] mb-1.5">Input</p>
                      <pre className="text-xs font-mono text-[#0f172a] whitespace-pre-wrap bg-[#f8fafc] p-2 rounded">{tc.input}</pre>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-[#64748b] mb-1.5">Output</p>
                      <pre className="text-xs font-mono text-[#0f172a] whitespace-pre-wrap bg-[#f8fafc] p-2 rounded">{tc.output}</pre>
                    </div>
                  </div>
                  {tc.explanation && (
                    <div className="px-4 py-3 border-t border-[#e2e8f0] bg-[#fffbeb]">
                      <p className="text-xs text-[#64748b]"><span className="font-medium">Explanation:</span> {tc.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        {/* Start Practice CTA */}
        <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
          <h3 className="text-sm font-semibold text-[#0f172a] mb-1">Ready to solve?</h3>
          <p className="text-xs text-[#64748b] mb-3">
            The interactive code editor is coming in a future release. Multi-language execution with automatic test case validation.
          </p>
          <Button variant="primary" size="sm" disabled>
            Start Practice (Coming Soon)
          </Button>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDelete}
        title="Delete question"
        message={`Are you sure you want to delete "${question.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        isLoading={isDeleting}
      />
    </AppShell>
  );
}
