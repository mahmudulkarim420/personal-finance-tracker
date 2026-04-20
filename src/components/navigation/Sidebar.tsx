"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Gem,
  LayoutDashboard,
  PieChart,
  Target,
  ShieldCheck,
  Users,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useUser, SignOutButton } from "@clerk/nextjs";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ArrowLeftRight, label: "Transactions", href: "/transactions" },
  { icon: PieChart, label: "Budgets", href: "/budgets" },
  { icon: Target, label: "Goals", href: "/goals" },
];

const adminItems = [
  { icon: ShieldCheck, label: "Admin Overview", href: "/admin/overview" },
  { icon: Users, label: "Manage Users", href: "/admin/users" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <aside className="flex w-full flex-col rounded-[28px] border border-white/10 bg-[#0D0D0D]/85 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:min-h-[calc(100vh-4rem)] lg:w-[240px] lg:min-w-[240px]">
        <div className="mb-8 flex items-center gap-3 px-2 animate-pulse">
          <div className="h-10 w-10 rounded-2xl bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-20 rounded bg-white/10" />
            <div className="h-2 w-16 rounded bg-white/10" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 lg:gap-1.5 animate-pulse">
          <div className="mb-2 h-3 w-16 mx-4 rounded-full bg-white/10" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-11 w-full rounded-2xl bg-white/5" />
          ))}
        </div>
      </aside>
    );
  }

  const role = user?.publicMetadata?.role as string | undefined;
  const isAdmin = role === "admin";

  const currentItems = isAdmin ? adminItems : navItems;
  const sectionLabel = isAdmin ? "Admin Section" : "Main Menu";

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex w-full flex-col rounded-[28px] border border-white/10 bg-[#0D0D0D]/85 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:min-h-[calc(100vh-4rem)] lg:w-[240px] lg:min-w-[240px]"
    >
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 shadow-[0_0_24px_rgba(16,185,129,0.15)]">
          <Gem className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">Obsidian Lens</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            Private Wealth
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 lg:gap-1.5">
        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-2">
          {sectionLabel}
        </p>
        {currentItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                isActive
                  ? isAdmin
                    ? "bg-purple-500/10 text-purple-400 shadow-[inset_0_0_0_1px_rgba(168,85,247,0.16)]"
                    : "bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.16)]"
                  : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
              )}
            >
              <item.icon
                className={clsx(
                  "h-4 w-4",
                  isActive
                    ? isAdmin ? "text-purple-400" : "text-emerald-400"
                    : "text-neutral-600"
                )}
                strokeWidth={1.5}
              />
              <span className="flex-1">{item.label}</span>
              {isActive ? (
                <span className={clsx("h-1.5 w-1.5 rounded-full", isAdmin ? "bg-purple-400" : "bg-emerald-400")} />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <SignOutButton redirectUrl="/">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-neutral-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 group">
            <LogOut className="h-4 w-4 text-neutral-600 group-hover:text-red-400 transition-colors" strokeWidth={1.5} />
            <span className="flex-1">Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </motion.aside>
  );
}
