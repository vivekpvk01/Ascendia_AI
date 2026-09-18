"use client";

/**
 * Ascendia AI — Admin Edit Question page
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { QuestionForm, QuestionFormData } from "@/components/practice/QuestionForm";
import { apiGet, apiPatch } from "@/lib/api/client";
import { PracticeQuestion } from "@/types/practice";
import { ApiResponse } from "@/types/api";

export default function AdminEditQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<PracticeQuestion>(`/api/v1/practice/${id}`).then((result) => {
      if (result.success && result.data) setQuestion(result.data);
      setIsLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: QuestionFormData) => {
    setServerError(null);
    const topics = data.topics.split(",").map((t) => t.trim()).filter(Boolean);
    const result = await apiPatch<PracticeQuestion>(`/api/v1/admin/questions/${id}`, {
      title: data.title,
      statement: data.statement,
      constraints: data.constraints || undefined,
      input_format: data.input_format || undefined,
      output_format: data.output_format || undefined,
      sample_tests: data.sample_tests.map((st) => ({
        input: st.input,
        output: st.output,
        explanation: st.explanation || undefined,
      })),
      difficulty: data.difficulty,
      topics,
      visibility: data.visibility,
      status: data.status,
    });

    if (result.success) {
      router.push("/admin/questions");
    } else {
      setServerError(result.error?.message ?? "Failed to update question.");
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <Spinner size={24} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-8">
        <Link href="/admin/questions" className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] transition-colors mb-4">
          <ArrowLeft size={14} />
          Back to Questions
        </Link>
        <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Edit Question</h1>
        <p className="text-[#64748b] text-sm mt-1">Update this curated practice question.</p>
      </div>

      <div className="max-w-3xl">
        {serverError && (
          <div className="mb-4 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-sm text-[#b91c1c]">
            {serverError}
          </div>
        )}
        {question ? (
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-[#0f172a]">Question Details</h2>
            </CardHeader>
            <CardBody>
              <QuestionForm
                defaultValues={{
                  title: question.title,
                  statement: question.statement,
                  constraints: question.constraints ?? "",
                  input_format: question.input_format ?? "",
                  output_format: question.output_format ?? "",
                  sample_tests: question.sample_tests,
                  difficulty: question.difficulty,
                  topics: question.topics.join(", "),
                  visibility: question.visibility,
                  status: question.status,
                }}
                onSubmit={handleSubmit}
                isAdmin={true}
                submitLabel="Save Changes"
                onCancel={() => router.push("/admin/questions")}
              />
            </CardBody>
          </Card>
        ) : (
          <div className="text-sm text-[#94a3b8]">Question not found.</div>
        )}
      </div>
    </AppShell>
  );
}
