/**
 * Ascendia AI — Badge component
 *
 * Communicates status and category. Used for file types, upload states, etc.
 */

import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]",
  success: "bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]",
  warning: "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]",
  error: "bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]",
  info: "bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd]",
  neutral: "bg-[#f8fafc] text-[#475569] border border-[#e2e8f0]",
};

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1",
        "px-2 py-0.5 rounded text-xs font-medium",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
