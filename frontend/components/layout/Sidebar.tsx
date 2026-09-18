"use client";

/**
 * Ascendia AI — Sidebar navigation
 *
 * Restrained, functional sidebar with active state, icon + label layout.
 * Does not visually dominate — the content is the focus.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Code2,
  CheckSquare,
  Settings,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Assessments", href: "/assessments", Icon: FileText },
  { label: "Practice", href: "/practice", Icon: Code2 },
  { label: "Submissions", href: "/submissions", Icon: CheckSquare },
];

const BOTTOM_NAV = [{ label: "Settings", href: "/settings", Icon: Settings }];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="fixed left-0 top-0 h-full w-56 bg-white border-r border-[#e2e8f0] flex flex-col z-20"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="h-14 flex items-center px-5 border-b border-[#e2e8f0] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group" aria-label="Ascendia AI home">
          <div className="w-7 h-7 rounded-md bg-[#1d4ed8] flex items-center justify-center shrink-0">
            <Zap size={14} className="text-white" aria-hidden="true" />
          </div>
          <span className="font-semibold text-[#0f172a] text-sm tracking-tight">
            Ascendia AI
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
