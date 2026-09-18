/**
 * Ascendia AI — Public Landing Page
 *
 * The public entry point. Separate from the authenticated app shell.
 * Uses the same Ascendia brand language but is a standalone layout.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Upload,
  Zap,
  Code2,
  TrendingUp,
  FileText,
  BookOpen,
  User,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ascendia AI — Practice the assessments that matter",
  description:
    "Transform placement assessments and coding problems into structured, interactive practice. Ascendia AI helps you prepare for technical placements with real company assessment material.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-[family-name:var(--font-inter)]">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 select-none group" aria-label="Ascendia AI home">
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Ascendia AI logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-[#0f172a] text-[15px] tracking-tight">
              Ascendia AI
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-[#475569]">
            <a href="#product" className="hover:text-[#0f172a] transition-colors">Product</a>
            <a href="#how-it-works" className="hover:text-[#0f172a] transition-colors">How it works</a>
            <a href="#practice" className="hover:text-[#0f172a] transition-colors">Practice</a>
            <Link href="/login" className="hover:text-[#0f172a] transition-colors">Sign in</Link>
          </div>

          {/* CTA */}
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 h-8 px-4 text-sm font-medium rounded-md bg-[#1d4ed8] text-white border border-[#1d4ed8] hover:bg-[#1e40af] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6" aria-label="Hero">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] border border-[#bfdbfe] text-[#1d4ed8] text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] inline-block"></span>
            Phase 2 — Now in development
          </div>

          <h1 className="text-5xl font-bold text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            Practice the assessments
            <br />
            <span className="text-[#1d4ed8]">that matter.</span>
          </h1>

          <p className="text-xl text-[#475569] leading-relaxed mb-10 max-w-xl mx-auto">
            Transform placement assessments and coding problems into structured,
            interactive practice.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 h-11 px-6 text-sm font-semibold rounded-md bg-[#1d4ed8] text-white border border-[#1d4ed8] hover:bg-[#1e40af] transition-colors"
            >
              Get Started
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 h-11 px-6 text-sm font-semibold rounded-md bg-white text-[#0f172a] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Product workflow ─────────────────────────────────────────────── */}
      <section id="product" className="py-20 px-6 bg-[#f8fafc] border-y border-[#e2e8f0]" aria-label="Product workflow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-3">
              From raw material to structured practice
            </h2>
            <p className="text-[#64748b] text-base max-w-lg mx-auto">
              Ascendia transforms unstructured assessment material into an interactive coding environment.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Step 1 */}
            <div className="flex-1 bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] mb-4">
                <FileText size={18} className="text-[#475569]" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-[#0f172a] mb-1">Assessment Material</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                PDF, DOCX, images, or text files from company placements and recruitment tests.
              </p>
            </div>

            {/* Arrow */}
            <div className="text-[#cbd5e1] rotate-90 md:rotate-0">
              <ArrowRight size={20} aria-hidden="true" />
            </div>

            {/* Step 2 */}
            <div className="flex-1 bg-[#1d4ed8] border border-[#1d4ed8] rounded-lg p-6 shadow-[0_1px_3px_0_rgba(29,78,216,0.2)]">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 border border-white/20 mb-4">
                <Image src="/logo-white.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Ascendia AI</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Structures and organizes the assessment content into discrete, solvable problems.
              </p>
            </div>

            {/* Arrow */}
            <div className="text-[#cbd5e1] rotate-90 md:rotate-0">
              <ArrowRight size={20} aria-hidden="true" />
            </div>

            {/* Step 3 */}
            <div className="flex-1 bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] mb-4">
                <Code2 size={18} className="text-[#475569]" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-[#0f172a] mb-1">Structured Practice</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Interactive coding problems with test cases, multi-language support, and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you can practice ────────────────────────────────────────── */}
      <section id="practice" className="py-20 px-6" aria-label="What you can practice">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-3">
              What you can practice
            </h2>
            <p className="text-[#64748b] text-base max-w-lg mx-auto">
              Three sources of coding problems — all in one unified practice environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assessment-based */}
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center">
                  <FileText size={16} className="text-[#1d4ed8]" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-[#0f172a]">Assessment-based Practice</h3>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Upload real placement assessments from any company. Problems are extracted and made
                available for structured practice.
              </p>
            </div>

            {/* Curated questions */}
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center">
                  <BookOpen size={16} className="text-[#15803d]" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-[#0f172a]">Curated Practice Questions</h3>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Admin-published questions covering common placement patterns. Reviewed and categorized
                by difficulty and topic.
              </p>
            </div>

            {/* Personal questions */}
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center">
                  <User size={16} className="text-[#b45309]" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-[#0f172a]">Personal Practice Questions</h3>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Create your own practice problems from memory or any source. Private by default —
                build your personal problem library.
              </p>
            </div>

            {/* Multi-language */}
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#f0f9ff] border border-[#bae6fd] flex items-center justify-center">
                  <Globe size={16} className="text-[#0369a1]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a]">Multi-language Execution</h3>
                  <span className="text-xs text-[#94a3b8] bg-[#f8fafc] border border-[#e2e8f0] px-1.5 py-0.5 rounded font-medium">Coming soon</span>
                </div>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Write and run code in multiple programming languages directly from the interface.
                Automatic test case validation and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 bg-[#f8fafc] border-y border-[#e2e8f0]" aria-label="How it works">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-[#64748b] text-base max-w-md mx-auto">
              A simple four-step workflow from assessment upload to performance insight.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: Upload,
                label: "Upload",
                desc: "Import assessment material. PDF, DOCX, image, or text.",
              },
              {
                step: "02",
                icon: Zap,
                label: "Transform",
                desc: "Ascendia structures the assessment into discrete problems.",
              },
              {
                step: "03",
                icon: Code2,
                label: "Practice",
                desc: "Solve problems in the coding environment.",
              },
              {
                step: "04",
                icon: TrendingUp,
                label: "Improve",
                desc: "Review submissions and track performance over time.",
              },
            ].map(({ step, icon: Icon, label, desc }) => (
              <div key={step} className="flex flex-col">
                <div className="text-xs font-bold text-[#94a3b8] tracking-widest mb-3">{step}</div>
                <div className="w-9 h-9 rounded-lg bg-white border border-[#e2e8f0] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex items-center justify-center mb-3">
                  <Icon size={16} className="text-[#1d4ed8]" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-[#0f172a] mb-1">{label}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" aria-label="Call to action">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-4">
            Build confidence before the assessment.
          </h2>
          <p className="text-[#64748b] text-base mb-8">
            Join students who practice smarter with real placement material.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 h-11 px-8 text-sm font-semibold rounded-md bg-[#1d4ed8] text-white border border-[#1d4ed8] hover:bg-[#1e40af] transition-colors"
          >
            Create your account
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#e2e8f0] bg-[#f8fafc]" aria-label="Footer">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3 select-none">
                <Image src="/logo.png" alt="Ascendia AI logo" width={22} height={22} className="w-[22px] h-[22px] object-contain" />
                <span className="font-semibold text-[#0f172a] text-sm">Ascendia AI</span>
              </Link>
              <p className="text-xs text-[#64748b] leading-relaxed max-w-[200px]">
                Transform placement assessments into interactive coding practice.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-[#0f172a] uppercase tracking-wide mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#practice" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">Practice</a></li>
                <li><a href="#product" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">Assessments</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold text-[#0f172a] uppercase tracking-wide mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-[#94a3b8] cursor-default">Documentation</span></li>
                <li><span className="text-sm text-[#94a3b8] cursor-default">GitHub</span></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-xs font-semibold text-[#0f172a] uppercase tracking-wide mb-3">Account</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">Create Account</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-[#94a3b8]">
              © {new Date().getFullYear()} Ascendia AI. University project.
            </p>
            <p className="text-xs text-[#94a3b8]">
              Built with Next.js and FastAPI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
