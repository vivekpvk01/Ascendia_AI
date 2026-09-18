"use client";

/**
 * Ascendia AI — QuestionList component
 * Filterable list of practice questions.
 */

import { useState } from "react";
import { QuestionRow } from "@/components/practice/QuestionRow";
import { PracticeQuestion, Difficulty, SourceType } from "@/types/practice";

interface QuestionListProps {
  questions: PracticeQuestion[];
  currentUserId?: string;
}

const DIFFICULTY_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All sources" },
  { value: "assessment", label: "Assessment-based" },
  { value: "admin", label: "Curated" },
  { value: "user", label: "Personal" },
];

export function QuestionList({ questions, currentUserId }: QuestionListProps) {
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = questions.filter((q) => {
    if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
    if (sourceFilter && q.source_type !== sourceFilter) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <input
            type="search"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 px-3 text-sm rounded-md border border-[#e2e8f0] bg-white text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] transition-colors"
            aria-label="Search questions"
          />
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="h-9 pl-3 pr-8 text-sm rounded-md border border-[#e2e8f0] bg-white text-[#475569] outline-none focus:border-[#1d4ed8] transition-colors"
          aria-label="Filter by difficulty"
        >
          {DIFFICULTY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="h-9 pl-3 pr-8 text-sm rounded-md border border-[#e2e8f0] bg-white text-[#475569] outline-none focus:border-[#1d4ed8] transition-colors"
          aria-label="Filter by source"
        >
          {SOURCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-[#94a3b8] mb-3">
        {filtered.length} question{filtered.length !== 1 ? "s" : ""}
        {search || difficultyFilter || sourceFilter ? " matching filters" : ""}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-sm text-[#94a3b8]">
          No questions match your filters.
        </div>
      ) : (
        <div className="divide-y divide-[#f1f5f9] rounded-lg border border-[#e2e8f0] bg-white overflow-hidden">
          {filtered.map((q) => (
            <QuestionRow key={q.id} question={q} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
