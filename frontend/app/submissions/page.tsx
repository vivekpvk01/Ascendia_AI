import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { CheckSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Submissions",
  description: "View your code submission history for assessment problems.",
};

export default function SubmissionsPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
          Submissions
        </h1>
        <p className="text-[#64748b] text-sm mt-1">
          Review your code submissions and evaluation results.
        </p>
      </div>
      <Card>
        <EmptyState
          icon={CheckSquare}
          title="No submissions yet"
          description="Your submission history will appear here once you begin practicing. Each submission is evaluated against test cases with structured feedback on correctness and edge cases."
        />
      </Card>
    </AppShell>
  );
}
