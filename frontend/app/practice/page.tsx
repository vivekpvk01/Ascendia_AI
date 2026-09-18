import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Practice",
  description: "Interactive practice sessions for placement assessment problems.",
};

export default function PracticePage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
          Practice
        </h1>
        <p className="text-[#64748b] text-sm mt-1">
          Solve structured coding problems from real placement assessments.
        </p>
      </div>
      <Card>
        <EmptyState
          icon={Code2}
          title="No problems available yet"
          description="Upload a placement assessment to generate interactive coding problems. You will be able to write, run, and submit code in multiple languages directly from this interface."
        />
      </Card>
    </AppShell>
  );
}
