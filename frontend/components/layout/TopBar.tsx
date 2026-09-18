"use client";

/**
 * Ascendia AI — TopBar
 *
 * Shows the current page context, a search placeholder, notification
 * placeholder, and user avatar. All non-implemented items are clearly
 * placeholder — never fake functionality.
 */

import { Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/assessments": "Assessments",
  "/assessments/new": "Upload Assessment",
  "/practice": "Practice",
  "/submissions": "Submissions",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Handle nested routes
  const match = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key));
  return match ? PAGE_TITLES[match] : "Ascendia AI";
}

export function TopBar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header
      className="fixed top-0 left-56 right-0 h-14 bg-white border-b border-[#e2e8f0] flex items-center gap-4 px-6 z-10"
      aria-label="Top bar"
    >
      {/* Page context */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-[#0f172a] truncate">{title}</span>
      </div>

      {/* Search placeholder */}
      <div className="hidden md:flex items-center gap-2 h-8 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-md w-56 text-[#94a3b8] text-sm cursor-default select-none">
        <Search size={13} aria-hidden="true" />
        <span>Search...</span>
      </div>

      {/* Notifications placeholder */}
      <button
        className="flex items-center justify-center w-8 h-8 rounded-md text-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#475569] transition-colors duration-100 outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8]"
        aria-label="Notifications (coming soon)"
        title="Notifications — coming soon"
        disabled
      >
        <Bell size={16} aria-hidden="true" />
      </button>

      {/* User avatar placeholder */}
      <div
        className="w-8 h-8 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white text-xs font-semibold shrink-0 select-none"
        aria-label="User profile"
        title="Vivek"
      >
        V
      </div>
    </header>
  );
}
