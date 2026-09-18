import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Ascendia AI account and preferences.",
};

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
          Settings
        </h1>
        <p className="text-[#64748b] text-sm mt-1">
          Manage your account and application preferences.
        </p>
      </div>
      <Card>
        <EmptyState
          icon={Settings}
          title="Settings coming soon"
          description="Account management, notification preferences, API key configuration, and assessment defaults will be configurable here in a future release."
        />
      </Card>
    </AppShell>
  );
}
