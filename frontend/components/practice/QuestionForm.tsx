"use client";

/**
 * Ascendia AI — QuestionForm component
 *
 * Reusable form for both student-created and admin questions.
 * Uses react-hook-form + zod.
 *
 * Props:
 *   defaultValues — pre-fill for edit mode
 *   onSubmit      — called with form data when valid
 *   isLoading     — show spinner on submit button
 *   isAdmin       — show admin-only fields (status, visibility=public)
 *   submitLabel   — customize the submit button text
 */

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Difficulty, QuestionStatus, QuestionVisibility, SampleTest } from "@/types/practice";

const sampleTestSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
  explanation: z.string().optional(),
});

const questionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(300),
  statement: z.string().min(10, "Problem statement must be at least 10 characters"),
  constraints: z.string().optional(),
  input_format: z.string().optional(),
  output_format: z.string().optional(),
  sample_tests: z.array(sampleTestSchema).max(10),
  difficulty: z.enum(["easy", "medium", "hard"]),
  topics: z.string(), // comma-separated
  visibility: z.enum(["private", "public"]),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  defaultValues?: Partial<QuestionFormData & { topics: string }>;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  isLoading?: boolean;
  isAdmin?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function QuestionForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  isAdmin = false,
  submitLabel = "Save Question",
  onCancel,
}: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      difficulty: "medium",
      visibility: "private",
      status: "draft",
      sample_tests: [],
      topics: "",
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "sample_tests" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Title */}
      <Field label="Title" id="qf-title" error={errors.title?.message} required>
        <input
          id="qf-title"
          type="text"
          placeholder="Two Sum"
          className={inputCls(!!errors.title)}
          {...register("title")}
        />
      </Field>

      {/* Statement */}
      <Field label="Problem Statement" id="qf-statement" error={errors.statement?.message} required>
        <textarea
          id="qf-statement"
          rows={6}
          placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
          className={inputCls(!!errors.statement) + " resize-y"}
          {...register("statement")}
        />
        <p className="text-xs text-[#94a3b8] mt-1">Supports plain text. Markdown rendering coming soon.</p>
      </Field>

      {/* Constraints + formats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Constraints" id="qf-constraints" error={errors.constraints?.message}>
          <textarea
            id="qf-constraints"
            rows={3}
            placeholder="1 ≤ n ≤ 10^5"
            className={inputCls(false) + " resize-y"}
            {...register("constraints")}
          />
        </Field>
        <div className="space-y-4">
          <Field label="Input Format" id="qf-input" error={errors.input_format?.message}>
            <textarea
              id="qf-input"
              rows={2}
              placeholder="First line: n integers"
              className={inputCls(false) + " resize-y"}
              {...register("input_format")}
            />
          </Field>
          <Field label="Output Format" id="qf-output" error={errors.output_format?.message}>
            <textarea
              id="qf-output"
              rows={2}
              placeholder="Two space-separated integers"
              className={inputCls(false) + " resize-y"}
              {...register("output_format")}
            />
          </Field>
        </div>
      </div>

      {/* Sample test cases */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[#0f172a]">Sample Test Cases</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<Plus size={13} />}
            onClick={() => append({ input: "", output: "", explanation: "" })}
            disabled={fields.length >= 10}
          >
            Add Test Case
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="text-xs text-[#94a3b8] py-3 text-center border border-dashed border-[#e2e8f0] rounded-md">
            No sample test cases. Add at least one to help students understand the problem.
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] relative">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-[#94a3b8] hover:text-[#b91c1c] transition-colors"
                  aria-label={`Remove test case ${index + 1}`}
                >
                  <Trash2 size={14} />
                </button>
                <p className="text-xs font-semibold text-[#475569] mb-3">Case {index + 1}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`qf-st-in-${index}`} className="text-xs font-medium text-[#64748b] mb-1 block">Input</label>
                    <textarea
                      id={`qf-st-in-${index}`}
                      rows={2}
                      className={inputCls(false) + " resize-y font-mono text-xs"}
                      {...register(`sample_tests.${index}.input`)}
                    />
                  </div>
                  <div>
                    <label htmlFor={`qf-st-out-${index}`} className="text-xs font-medium text-[#64748b] mb-1 block">Output</label>
                    <textarea
                      id={`qf-st-out-${index}`}
                      rows={2}
                      className={inputCls(false) + " resize-y font-mono text-xs"}
                      {...register(`sample_tests.${index}.output`)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label htmlFor={`qf-st-exp-${index}`} className="text-xs font-medium text-[#64748b] mb-1 block">Explanation (optional)</label>
                  <input
                    id={`qf-st-exp-${index}`}
                    type="text"
                    className={inputCls(false)}
                    {...register(`sample_tests.${index}.explanation`)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Difficulty + Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Difficulty" id="qf-difficulty" error={errors.difficulty?.message} required>
          <select
            id="qf-difficulty"
            className={inputCls(!!errors.difficulty)}
            {...register("difficulty")}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </Field>
        <Field label="Topics" id="qf-topics" error={errors.topics?.message}>
          <input
            id="qf-topics"
            type="text"
            placeholder="arrays, hash-map, two-pointers"
            className={inputCls(!!errors.topics)}
            {...register("topics")}
          />
          <p className="text-xs text-[#94a3b8] mt-1">Comma-separated</p>
        </Field>
      </div>

      {/* Visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Visibility" id="qf-visibility" error={errors.visibility?.message}>
          <select
            id="qf-visibility"
            className={inputCls(!!errors.visibility)}
            {...register("visibility")}
          >
            <option value="private">Private — only I can see this</option>
            <option value="public">Public — visible to all students</option>
          </select>
        </Field>

        {/* Admin-only: status */}
        {isAdmin && (
          <Field label="Status" id="qf-status" error={errors.status?.message}>
            <select
              id="qf-status"
              className={inputCls(!!errors.status)}
              {...register("status")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
          {isLoading ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

/* ── Internal helpers ──────────────────────────────────────────────────────── */

function Field({
  label,
  id,
  error,
  required,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#0f172a] mb-1.5">
        {label}
        {required && <span className="text-[#b91c1c] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[#b91c1c] mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean): string {
  return [
    "w-full px-3 py-2 text-sm rounded-md border bg-white text-[#0f172a]",
    "placeholder:text-[#94a3b8] outline-none transition-colors",
    "focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]",
    hasError ? "border-[#b91c1c]" : "border-[#e2e8f0]",
  ].join(" ");
}
