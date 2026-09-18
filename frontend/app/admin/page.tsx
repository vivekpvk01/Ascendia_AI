/**
 * Ascendia AI — Admin dashboard page
 */

import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardBody } from "@/components/ui/Card";
import { BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Ascendia AI administration panel.",
};

export default function AdminPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Administration</h1>
        <p className="text-[#64748b] text-sm mt-1">
          Manage the Ascendia AI platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
        <Link
          href="/admin/questions"
          className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8] rounded-lg"
        >
          <Card interactive>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center mb-3">
                  <BookOpen size={18} className="text-[#1d4ed8]" aria-hidden="true" />
                </div>
                <ArrowRight size={16} className="text-[#94a3b8] group-hover:text-[#1d4ed8] transition-colors" />
              </div>
              <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Practice Questions</h2>
              <p className="text-xs text-[#64748b]">
                Create, publish, and manage curated practice questions for all students.
              </p>
            </CardBody>
          </Card>
        </Link>
      </div>
    </AppShell>
  );
}
