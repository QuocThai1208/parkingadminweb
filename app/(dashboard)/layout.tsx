"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useUserStore } from "@/src/stores/useUserStore";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/components/loading-overlay";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const hasHydrated = useUserStore((state) => state._hasHydrated);
  const [lotId, setLotId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selected_parking_id") || "";
    }
    return "";
  });

  useEffect(() => {
    if (hasHydrated &&!isLoggedIn) {
      window.location.href = "/login";
    }
    if (!lotId) {
      window.location.href = "/select-parkinglot";
    }
  }, [isLoggedIn, lotId, hasHydrated]);

  if (!hasHydrated || !isLoggedIn || !lotId) {
    return <LoadingOverlay isLoading={true} />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
