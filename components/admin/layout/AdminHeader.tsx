"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Layers,
  PlayCircle,
  Tag,
  LayoutDashboard,
  Menu,
  ExternalLink,
  X,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLogOutButton from "./AdminLogOutButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useUser } from "@clerk/nextjs";
import { SUPER_ADMIN_EMAIL } from "@/lib/admin";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/modules", label: "Modules", icon: Layers },
  { href: "/admin/lessons", label: "Lessons", icon: PlayCircle },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

const SUPER_ADMIN_NAV = [
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
];

function AdminHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const email = user?.emailAddresses?.[0]?.emailAddress || "";
  const isSuperAdmin = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const allNavItems = isSuperAdmin
    ? [...NAV_ITEMS, ...SUPER_ADMIN_NAV]
    : NAV_ITEMS;

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-2xl">
        <div className="flex h-14 items-center px-4 lg:px-6 max-w-[1400px] mx-auto">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-semibold lg:mr-10 shrink-0"
          >
            <Logo size={30} showText={false} />
            <span className="text-sm font-bold text-slate-900 tracking-tight hidden sm:inline">
              Admin Panel
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 ml-2">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200",
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/studio"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Studio
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <AdminLogOutButton />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-72 bg-white border-l border-slate-200 p-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-semibold text-slate-900">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-slate-900"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <nav className="space-y-1">
              {allNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
              <Link
                href="/studio"
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Open Studio
              </Link>
              <div className="px-3">
                <AdminLogOutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminHeader;
