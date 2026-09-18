/**
 * Ascendia AI — AppShell
 *
 * Wraps every page with the persistent sidebar and topbar.
 * Main content is offset to account for fixed positioning.
 */

import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <TopBar />
      <main
        id="main-content"
        className="ml-56 pt-14 min-h-screen"
        tabIndex={-1}
      >
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
