/**
 * Ascendia AI — DifficultyBadge component
 */

import { Badge } from "@/components/ui/Badge";
import { Difficulty } from "@/types/practice";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const variantMap: Record<Difficulty, "success" | "warning" | "error"> = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

const labelMap: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <Badge variant={variantMap[difficulty]}>
      {labelMap[difficulty]}
    </Badge>
  );
}
