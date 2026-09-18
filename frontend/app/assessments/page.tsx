import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FileText, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Assessments",
  description:
    "View and manage your uploaded placement assessments. Create realistic coding practice sessions from assessment material.",
};

export default function AssessmentsPage() {
  // In Phase 1, there are no assessments. Future phases will fetch from the API.
  const assessments: unknown[] = [];

  return (
    <AppShell>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
            Assessments
          </h1>
          <p className="text-[#64748b] text-sm mt-1">
            Create realistic coding practice sessions from assessment material.
          </p>
        </div>
        <div className="shrink-0">
          <Link href="/assessments/new">
            <Button variant="primary" size="md" leftIcon={<Plus size={14} />}>
              Upload Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Search + filter row — placeholder until data exists */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="search"
            placeholder="Search assessments..."
            className="w-full h-9 pl-3 pr-3 text-sm bg-white border border-[#e2e8f0] rounded-md text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] transition-colors"
            disabled
            aria-label="Search assessments (coming soon)"
            title="Search will be available once assessments are uploaded"
          />
        </div>
        <select
          className="h-9 pl-3 pr-8 text-sm bg-white border border-[#e2e8f0] rounded-md text-[#94a3b8] outline-none cursor-not-allowed opacity-60"
          disabled
          aria-label="Filter assessments (coming soon)"
        >
          <option>All types</option>
        </select>
      </div>

      {/* Assessment list / empty state */}
      {assessments.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No assessments yet"
            description="Upload a placement assessment or coding question paper to create your first Ascendia assessment. Supported formats include PDF, DOCX, PNG, JPG, and TXT."
            action={
              <Link href="/assessments/new">
                <Button variant="primary" size="md" leftIcon={<Plus size={14} />}>
                  Upload Assessment
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        /* Assessment table will be rendered here in a future phase */
        <div />
      )}
    </AppShell>
  );
}
