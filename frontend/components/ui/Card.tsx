/**
 * Ascendia AI — Card component
 *
 * A restrained surface container with subtle border and shadow.
 */

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Adds a slight hover state — use for interactive cards */
  interactive?: boolean;
  as?: React.ElementType;
}

export function Card({
  children,
  className = "",
  interactive = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={[
        "bg-white border border-[#e2e8f0] rounded-lg",
        "shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.03)]",
        interactive &&
          "transition-shadow duration-150 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div
      className={[
        "px-6 py-4 border-b border-[#e2e8f0]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = "" }: CardBodyProps) {
  return (
    <div className={["px-6 py-5", className].filter(Boolean).join(" ")}>{children}</div>
  );
}
