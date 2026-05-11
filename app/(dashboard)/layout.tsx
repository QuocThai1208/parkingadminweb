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
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  const [isReady, setIsReady] = useState(false);
  const [lotId, setLotId] = useState<string | null>(null);

  useEffect(() => {
    if (hasHydrated) {
      const savedLotId = localStorage.getItem("selected_parking_id");
      
      if (!isLoggedIn) {
        router.replace("/login");
      } else if (!savedLotId) {
        router.replace("/select-parkinglot");
      } else {
        setLotId(savedLotId);
        setIsReady(true); 
      }
    }
  }, [hasHydrated, isLoggedIn, router]);

  if (!isReady) {
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
