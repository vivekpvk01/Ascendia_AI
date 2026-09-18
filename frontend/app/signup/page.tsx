"use client";

/**
 * Ascendia AI — Signup page
 *
 * Focused registration experience. No app shell.
 * Redirects to /dashboard after successful account creation.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { signup } from "@/lib/api/auth";

const signupSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    const result = await signup(data.name, data.email, data.password);
    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setServerError(result.error?.message ?? "Account creation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo link */}
      <Link
        href="/"
        className="flex items-center gap-2 mb-8 select-none group outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8] rounded"
        aria-label="Ascendia AI home"
      >
        <Image src="/logo.png" alt="Ascendia AI logo" width={28} height={28} className="w-7 h-7 object-contain" />
        <span className="font-semibold text-[#0f172a] text-[15px] tracking-tight">Ascendia AI</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.03)] p-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#0f172a] tracking-tight">Create account</h1>
          <p className="text-sm text-[#64748b] mt-1">Start practicing with Ascendia AI.</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg mb-4"
          >
            <AlertCircle size={15} className="text-[#b91c1c] mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-[#b91c1c]">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Full name */}
          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Vivek Sharma"
              className={[
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-[#0f172a]",
                "placeholder:text-[#94a3b8] outline-none transition-colors",
                "focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]",
                errors.name ? "border-[#b91c1c]" : "border-[#e2e8f0]",
              ].join(" ")}
              {...register("name")}
              aria-describedby={errors.name ? "signup-name-error" : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p id="signup-name-error" className="text-xs text-[#b91c1c] mt-1" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={[
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-[#0f172a]",
                "placeholder:text-[#94a3b8] outline-none transition-colors",
                "focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]",
                errors.email ? "border-[#b91c1c]" : "border-[#e2e8f0]",
              ].join(" ")}
              {...register("email")}
              aria-describedby={errors.email ? "signup-email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="signup-email-error" className="text-xs text-[#b91c1c] mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={[
                  "w-full h-9 px-3 pr-9 text-sm rounded-md border bg-white text-[#0f172a]",
                  "placeholder:text-[#94a3b8] outline-none transition-colors",
                  "focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]",
                  errors.password ? "border-[#b91c1c]" : "border-[#e2e8f0]",
                ].join(" ")}
                {...register("password")}
                aria-describedby={errors.password ? "signup-password-error" : undefined}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] outline-none focus-visible:text-[#1d4ed8]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p id="signup-password-error" className="text-xs text-[#b91c1c] mt-1" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="signup-confirm" className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="signup-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={[
                  "w-full h-9 px-3 pr-9 text-sm rounded-md border bg-white text-[#0f172a]",
                  "placeholder:text-[#94a3b8] outline-none transition-colors",
                  "focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]",
                  errors.confirmPassword ? "border-[#b91c1c]" : "border-[#e2e8f0]",
                ].join(" ")}
                {...register("confirmPassword")}
                aria-describedby={errors.confirmPassword ? "signup-confirm-error" : undefined}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] outline-none focus-visible:text-[#1d4ed8]"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="signup-confirm-error" className="text-xs text-[#b91c1c] mt-1" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-9 px-4 text-sm font-semibold rounded-md bg-[#1d4ed8] text-white border border-[#1d4ed8] hover:bg-[#1e40af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-sm text-[#64748b] text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#1d4ed8] font-medium hover:underline outline-none focus-visible:ring-1 focus-visible:ring-[#1d4ed8] rounded"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
