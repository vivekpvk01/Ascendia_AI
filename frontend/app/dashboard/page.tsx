"use client";

/**
 * Ascendia AI — Overview/Dashboard page
 *
 * Shows a personalized greeting using the authenticated user's name.
 * Stat cards and empty states remain until real data is connected.
 */

import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { FileText, Activity, Clock, Code2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/app/providers/AuthProvider";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  const hour = new Date().getHours();
  const timeOfDay =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = isLoading ? "" : (user?.name?.split(" ")[0] ?? "there");
  const greeting = `${timeOfDay}${displayName ? `, ${displayName}` : ""}`;

  return (
    <AppShell>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
          {isLoading ? "Loading…" : greeting}
        </h1>
        <p className="text-[#64748b] text-sm mt-1">
          Continue your assessment preparation.
        </p>
      </div>

      {/* Quick action row */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/assessments/new">
          <Button variant="primary" size="md" leftIcon={<FileText size={14} />}>
            Upload Assessment
          </Button>
        </Link>
        <Link href="/practice">
          <Button variant="secondary" size="md" leftIcon={<Code2 size={14} />}>
            Browse Practice
          </Button>
        </Link>
      </div>

      {/* Overview grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Assessments uploaded"
          value="—"
          description="Upload your first assessment to get started."
        />
        <StatCard
          label="Problems practiced"
          value="—"
          description="Practice sessions will appear here."
        />
        <StatCard
          label="Submissions"
          value="—"
          description="Your submissions will be tracked here."
        />
      </div>

      {/* Recent Assessments */}
      <div className="mb-8">
        <SectionHeader title="Recent Assessments" />
        <Card>
          <EmptyState
            icon={FileText}
            title="No assessments yet"
            description="Upload a placement assessment or coding question paper to create your first Ascendia assessment. Your recent uploads will appear here."
            action={
              <Link href="/assessments/new">
                <Button variant="secondary" size="sm">
                  Upload Assessment
                </Button>
              </Link>
            }
          />
        </Card>
      </div>

      {/* Continue Practice */}
      <div className="mb-8">
        <SectionHeader title="Continue Practice" />
        <Card>
          <EmptyState
            icon={Activity}
            title="No practice sessions yet"
            description="Once you have uploaded and processed an assessment, you can start a structured practice session here. Track your progress across all problems."
            action={
              <Link href="/practice">
                <Button variant="secondary" size="sm">
                  Browse Questions
                </Button>
              </Link>
            }
          />
        </Card>
      </div>

      {/* Recent Submissions */}
      <div>
        <SectionHeader title="Recent Submissions" />
        <Card>
          <EmptyState
            icon={Clock}
            title="No submissions yet"
            description="Your code submission history will appear here. Each submission is evaluated against test cases and you will receive structured feedback."
          />
        </Card>
      </div>
    </AppShell>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-[#0f172a]">{title}</h2>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-2xl font-semibold text-[#0f172a] mb-1">{value}</p>
        <p className="text-xs text-[#94a3b8]">{description}</p>
      </CardBody>
    </Card>
  );
}
