/**
 * Ascendia AI — Spinner component
 */

import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export function Spinner({ size = 18, className = "", label = "Loading..." }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex items-center">
      <Loader2 size={size} className={["animate-spin text-[#1d4ed8]", className].join(" ")} />
    </span>
  );
}
