"use client";

/**
 * Ascendia AI — Admin Create Question page
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { QuestionForm, QuestionFormData } from "@/components/practice/QuestionForm";
import { apiPost } from "@/lib/api/client";
import { PracticeQuestion } from "@/types/practice";

export default function AdminCreateQuestionPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (data: QuestionFormData) => {
    setServerError(null);
    const topics = data.topics.split(",").map((t) => t.trim()).filter(Boolean);
    const result = await apiPost<PracticeQuestion>("/api/v1/admin/questions", {
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
      status: data.status ?? "draft",
    });

    if (result.success && result.data) {
      router.push("/admin/questions");
    } else {
      setServerError(result.error?.message ?? "Failed to create question.");
    }
  };

  return (
    <AppShell>
      <div className="mb-8">
        <Link href="/admin/questions" className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] transition-colors mb-4">
          <ArrowLeft size={14} />
          Back to Questions
        </Link>
        <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Create Curated Question</h1>
        <p className="text-[#64748b] text-sm mt-1">Create an official practice question visible to all students when published.</p>
      </div>

      <div className="max-w-3xl">
        {serverError && (
          <div className="mb-4 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-sm text-[#b91c1c]">
            {serverError}
          </div>
        )}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-[#0f172a]">Question Details</h2>
          </CardHeader>
          <CardBody>
            <QuestionForm
              onSubmit={handleSubmit}
              isAdmin={true}
              submitLabel="Create Question"
              onCancel={() => router.push("/admin/questions")}
            />
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
