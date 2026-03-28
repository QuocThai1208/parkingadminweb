"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  UserCog,
  Contact,
  CarFront,
  Banknote,
  LogOut,
  LayoutDashboard,
  ChartBar,
  BarChart3
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppRouter } from "@/src/router/userAppRouter";
import { useUserStore } from "@/src/stores/useUserStore";

interface NavItem {
  title: string;
  titleVi: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboar",
    titleVi: "Bản điều khiển",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    description: "Hệ thống quản lý giữ xe",
  }, {
    title: "Parking Logs",
    titleVi: "Quản lý lịch sử giữ xe",
    href: "/logs",
    icon: <History className="w-5 h-5" />,
    description: "Xem lịch sử giữ xe",
  },
  {
    title: "Employees",
    titleVi: "Quản lý nhân viên",
    href: "/employees",
    icon: <UserCog className="w-5 h-5" />,
    description: "Quản lý tài khoản nhân viên",
  },
  {
    title: "Customers",
    titleVi: "Quản lý khách hàng",
    href: "/customers",
    icon: <Contact className="w-5 h-5" />,
    description: "Quản lý dữ liệu khách hàng",
  },
  {
    title: "Vehicles",
    titleVi: "Quản lý phương tiện",
    href: "/vehicles",
    icon: <CarFront className="w-5 h-5" />,
    description: "Quản lý danh sách phương tiện",
  },
  {
    title: "Pricing",
    titleVi: "Quản lý bảng giá giữ xe",
    href: "/pricing",
    icon: <Banknote className="w-5 h-5" />,
    description: "Cấu hình giá giữ xe",
  },
  {
    title: "Pricing",
    titleVi: "Phân tích",
    href: "/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Phân tích thông tin",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const {goToLogin} = useAppRouter()
  const login = useUserStore((state) => state.logout)

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="py-4 px-2 transition-all duration-200">
          <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);

            return (
              <SidebarMenuItem
                key={item.href}
                className={cn(
                  "mx-2"
                )}
              >
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={state === "collapsed" ? item.titleVi : undefined}
                  className={cn(
                    "transition-all duration-200 ease-out",
                    "hover:bg-sidebar-accent/50",
                    isActive &&
                    "!bg-primary !text-primary-foreground font-medium shadow-sm ",
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "transition-transform duration-200",
                        isActive && "scale-110",
                      )}
                    >
                      {item.icon}
                    </span>
                    {state === "expanded" && (
                      <span className="text-sm font-medium">
                        {item.titleVi}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="py-4 px-2">
        <SidebarSeparator className="mb-3" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
              login(),
              localStorage.removeItem("authToken")
              localStorage.removeItem('refresh')
              goToLogin()
          }}
        >
          <LogOut className="w-4 h-4" />
          {state === "expanded" && <span>Đăng xuất</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
