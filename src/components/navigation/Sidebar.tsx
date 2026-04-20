"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Gem,
  LayoutDashboard,
  PieChart,
  Settings,
  Target,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ArrowLeftRight, label: "Transactions", href: "/transactions" },
  { icon: PieChart, label: "Budgets", href: "/budgets" },
  { icon: Target, label: "Goals", href: "/goals" },
];

export function Sidebar() {
  const pathname = usePathname();

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
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.16)]"
                  : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
              )}
            >
              <item.icon
                className={clsx("h-4 w-4", isActive ? "text-emerald-400" : "text-neutral-600")}
                strokeWidth={1.5}
              />
              <span className="flex-1">{item.label}</span>
              {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> : null}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        className={clsx(
          "mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200",
          pathname === "/settings"
            ? "bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.16)]"
            : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
        )}
      >
        <Settings
          className={clsx(
            "h-4 w-4",
            pathname === "/settings" ? "text-emerald-400" : "text-neutral-600"
          )}
          strokeWidth={1.5}
        />
        <span>Settings</span>
      </Link>
    </motion.aside>
  );
}
