/**
 * Ascendia AI — Button component
 *
 * Variants: primary | secondary | ghost | danger
 * Sizes: sm | md | lg
 */

import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1d4ed8] text-white border border-[#1d4ed8] hover:bg-[#1e40af] hover:border-[#1e40af] focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2",
  secondary:
    "bg-white text-[#0f172a] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2",
  ghost:
    "bg-transparent text-[#475569] border border-transparent hover:bg-[#f1f5f9] hover:text-[#0f172a] focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2",
  danger:
    "bg-[#b91c1c] text-white border border-[#b91c1c] hover:bg-[#991b1b] hover:border-[#991b1b] focus-visible:ring-2 focus-visible:ring-[#b91c1c] focus-visible:ring-offset-2",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={[
        "inline-flex items-center justify-center font-medium rounded-md",
        "transition-colors duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "outline-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={14} className="animate-spin shrink-0" aria-hidden="true" />
      ) : leftIcon ? (
        <span className="shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
