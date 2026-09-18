"use client";

/**
 * Ascendia AI — TopBar
 *
 * Shows the current page context and a user avatar with logout.
 * Displays the real user's initial from auth context.
 */

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/assessments": "Assessments",
  "/assessments/new": "Upload Assessment",
  "/practice": "Practice",
  "/practice/create": "Create Question",
  "/submissions": "Submissions",
  "/settings": "Settings",
  "/admin": "Administration",
  "/admin/questions": "Practice Questions",
  "/admin/questions/new": "Create Question",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key));
  return match ? PAGE_TITLES[match] : "Asendia AI";
}

export function TopBar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const { user, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const initial = user?.name?.[0]?.toUpperCase() ?? "?";
  const displayName = user?.name ?? "Account";

  return (
    <header
      className="fixed top-0 left-56 right-0 h-14 bg-white border-b border-[#e2e8f0] flex items-center gap-4 px-6 z-10"
      aria-label="Top bar"
    >
      {/* Page context */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-[#0f172a] truncate">{title}</span>
      </div>

      {/* User avatar + dropdown */}
      {!isLoading && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[#f8fafc] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8]"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="User menu"
          >
            <div
              className="w-7 h-7 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white text-xs font-semibold shrink-0 select-none"
              aria-hidden="true"
            >
              {initial}
            </div>
            <span className="text-sm text-[#475569] hidden sm:block truncate max-w-[120px]">
              {displayName}
            </span>
            <ChevronDown size={13} className="text-[#94a3b8] hidden sm:block" aria-hidden="true" />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e2e8f0] rounded-lg shadow-[0_4px_12px_0_rgba(0,0,0,0.08)] py-1 z-50"
              role="menu"
            >
              <div className="px-3 py-2 border-b border-[#f1f5f9]">
                <p className="text-xs font-medium text-[#0f172a] truncate">{displayName}</p>
                <p className="text-xs text-[#94a3b8] truncate">{user?.email}</p>
              </div>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1d4ed8]"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                <LogOut size={14} aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
