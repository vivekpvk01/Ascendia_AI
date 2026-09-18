/**
 * Ascendia AI — EmptyState component
 *
 * Used throughout the app to replace meaningless blank areas.
 * Explains what the section is, why it matters, and what to do next.
 */

import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center",
        "py-16 px-8 max-w-sm mx-auto",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] mb-4">
        <Icon size={22} className="text-[#64748b]" aria-hidden="true" />
      </div>
      <h3 className="text-[#0f172a] font-semibold text-base mb-2">{title}</h3>
      <p className="text-[#64748b] text-sm leading-relaxed mb-6">{description}</p>
      {action}
    </div>
  );
}
