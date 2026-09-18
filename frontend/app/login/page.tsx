"use client";

/**
 * Ascendia AI — Login page
 *
 * Focused authentication experience. No app shell.
 * Matches the Ascendia brand language without copying the dashboard layout.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/api/auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const result = await login(data.email, data.password);
    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setServerError(result.error?.message ?? "Sign in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4">
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
          <h1 className="text-xl font-semibold text-[#0f172a] tracking-tight">Sign in</h1>
          <p className="text-sm text-[#64748b] mt-1">Welcome back to Ascendia AI.</p>
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
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Email
            </label>
            <input
              id="login-email"
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
              aria-describedby={errors.email ? "login-email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="login-email-error" className="text-xs text-[#b91c1c] mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-sm font-medium text-[#0f172a]">
                Password
              </label>
              <span className="text-xs text-[#94a3b8] cursor-default" title="Password reset coming soon">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={[
                  "w-full h-9 px-3 pr-9 text-sm rounded-md border bg-white text-[#0f172a]",
                  "placeholder:text-[#94a3b8] outline-none transition-colors",
                  "focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]",
                  errors.password ? "border-[#b91c1c]" : "border-[#e2e8f0]",
                ].join(" ")}
                {...register("password")}
                aria-describedby={errors.password ? "login-password-error" : undefined}
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
              <p id="login-password-error" className="text-xs text-[#b91c1c] mt-1" role="alert">
                {errors.password.message}
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
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Signup link */}
        <p className="text-sm text-[#64748b] text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#1d4ed8] font-medium hover:underline outline-none focus-visible:ring-1 focus-visible:ring-[#1d4ed8] rounded"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
