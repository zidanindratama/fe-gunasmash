"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-muted/10">
      <aside
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 z-50 transition-all duration-300 ease-in-out border-r bg-background",
          isCollapsed ? "w-[80px]" : "w-72"
        )}
      >
        <Sidebar
          className="border-none"
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0",
          isCollapsed ? "md:ml-[80px]" : "md:ml-72"
        )}
      >
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
