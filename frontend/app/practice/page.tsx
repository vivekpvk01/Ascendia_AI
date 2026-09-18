"use client";

/**
 * Ascendia AI — Practice Library page
 *
 * Shows the practice question library when questions exist,
 * empty state with CTA when it's empty.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Code2, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { QuestionList } from "@/components/practice/QuestionList";
import { listQuestions } from "@/lib/api/practice";
import { useAuth } from "@/app/providers/AuthProvider";
import { PracticeQuestion } from "@/types/practice";

export default function PracticePage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    listQuestions().then((result) => {
      if (!mounted) return;
      if (result.success && result.data) {
        setQuestions(result.data);
      } else {
        setError(result.error?.message ?? "Failed to load questions.");
      }
      setIsLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <AppShell>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Practice</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Solve structured coding problems from placement assessments and curated libraries.
          </p>
        </div>
        <div className="shrink-0">
          <Link href="/practice/create">
            <Button variant="primary" size="md" leftIcon={<Plus size={14} />}>
              Create Question
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size={24} label="Loading questions…" />
        </div>
      ) : error ? (
        <Card>
          <div className="flex items-center justify-center py-16 text-sm text-[#b91c1c]">
            {error}
          </div>
        </Card>
      ) : questions.length === 0 ? (
        <Card>
          <EmptyState
            icon={Code2}
            title="No problems available yet"
            description="Upload a placement assessment to generate practice problems, or create your own personal practice questions to build your library."
            action={
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/assessments/new">
                  <Button variant="primary" size="sm">Upload Assessment</Button>
                </Link>
                <Link href="/practice/create">
                  <Button variant="secondary" size="sm">Create Question</Button>
                </Link>
              </div>
            }
          />
        </Card>
      ) : (
        <QuestionList questions={questions} currentUserId={user?.id} />
      )}
    </AppShell>
  );
}
