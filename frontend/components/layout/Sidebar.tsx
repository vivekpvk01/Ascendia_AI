"use client";

/**
 * Ascendia AI — Sidebar navigation
 *
 * Restrained, functional sidebar with active state, icon + label layout.
 * Admin section conditionally rendered based on user role.
 * Does not visually dominate — the content is the focus.
 */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Code2,
  CheckSquare,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Assessments", href: "/assessments", Icon: FileText },
  { label: "Practice", href: "/practice", Icon: Code2 },
  { label: "Submissions", href: "/submissions", Icon: CheckSquare },
];

const ADMIN_NAV = [
  { label: "Questions", href: "/admin/questions", Icon: ShieldCheck },
];

const BOTTOM_NAV = [{ label: "Settings", href: "/settings", Icon: Settings }];

export function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="fixed left-0 top-0 h-full w-56 bg-white border-r border-[#e2e8f0] flex flex-col z-20"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="h-14 flex items-center px-5 border-b border-[#e2e8f0] shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group select-none"
          aria-label="Asendia AI home"
        >
          <div className="w-7 h-7 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Asendia AI logo"
              width={28}
              height={28}
              className="w-7 h-7 object-contain transition-transform duration-150 group-hover:scale-105"
              priority
            />
          </div>
          <span className="font-semibold text-[#0f172a] text-[15px] tracking-tight">
            Asendia AI
          </span>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Primary">
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map(({ label, href, Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                    "transition-colors duration-100 outline-none",
                    active
                      ? "bg-[#eff6ff] text-[#1d4ed8]"
                      : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]",
                    "focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-inset",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Icon
                    size={16}
                    className={active ? "text-[#1d4ed8]" : "text-[#94a3b8]"}
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Admin section — only for admin users */}
        {isAdmin && (
          <div className="mt-5 pt-4 border-t border-[#f1f5f9]">
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-widest">
              Admin
            </p>
            <ul className="space-y-0.5" role="list">
              <li>
                <Link
                  href="/admin"
                  aria-current={pathname === "/admin" ? "page" : undefined}
                  className={[
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                    "transition-colors duration-100 outline-none",
                    pathname.startsWith("/admin")
                      ? "bg-[#eff6ff] text-[#1d4ed8]"
                      : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]",
                    "focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-inset",
                  ].filter(Boolean).join(" ")}
                >
                  <ShieldCheck
                    size={16}
                    className={pathname.startsWith("/admin") ? "text-[#1d4ed8]" : "text-[#94a3b8]"}
                    aria-hidden="true"
                  />
                  Administration
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-4 border-t border-[#e2e8f0] pt-3">
        <ul className="space-y-0.5" role="list">
          {BOTTOM_NAV.map(({ label, href, Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                    "transition-colors duration-100 outline-none",
                    active
                      ? "bg-[#eff6ff] text-[#1d4ed8]"
                      : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]",
                    "focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-inset",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Icon
                    size={16}
                    className={active ? "text-[#1d4ed8]" : "text-[#94a3b8]"}
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
