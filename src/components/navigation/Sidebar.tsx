"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  Gem,
  LayoutDashboard,
  PieChart,
  Target,
  ShieldCheck,
  Users,
  LogOut,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useEffect } from "react";

// User navigation items
const userNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ArrowLeftRight, label: "Transactions", href: "/transactions" },
  { icon: PieChart, label: "Budgets", href: "/budgets" },
  { icon: Target, label: "Goals", href: "/goals" },
];

// Admin navigation items
const adminNavItems = [
  { icon: ShieldCheck, label: "Admin Overview", href: "/admin/overview" },
  { icon: Users, label: "Manage Users", href: "/admin/users" },
];

// Navigation item type
interface NavItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  href: string;
}

function SidebarContent({
  pathname,
  onClose,
  isAdmin,
  sectionLabel,
  currentItems,
}: {
  pathname: string;
  onClose: () => void;
  isAdmin: boolean;
  sectionLabel: string;
  currentItems: NavItem[];
}) {
  return (
    <div className="flex h-full w-full flex-col p-6 overflow-y-auto">
      {/* Brand */}
      <div className="mb-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 shadow-[0_0_24px_rgba(16,185,129,0.15)]">
            <Gem className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-tight text-white">Obsidian Lens</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
              Private Wealth
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-2 text-neutral-500 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <p className="px-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-700 mb-2">
          {sectionLabel}
        </p>
        <div className="space-y-1">
          {currentItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? isAdmin
                      ? "text-purple-400"
                      : "text-emerald-400"
                    : "text-neutral-500 hover:bg-white/[0.04] hover:text-neutral-300",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className={clsx(
                      "absolute inset-0 rounded-2xl border border-white/5",
                      isAdmin ? "bg-purple-500/10" : "bg-emerald-500/10",
                    )}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon
                  className={clsx(
                    "relative z-10 h-4.5 w-4.5 transition-colors duration-300",
                    isActive
                      ? isAdmin
                        ? "text-purple-400"
                        : "text-emerald-400"
                      : "text-neutral-600 group-hover:text-neutral-400",
                  )}
                  strokeWidth={1.5}
                />
                <span className="relative z-10 flex-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className={clsx(
                      "h-1 w-1 rounded-full relative z-10",
                      isAdmin
                        ? "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                        : "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 shrink-0">
        <SignOutButton redirectUrl="/">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-neutral-500 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-400 group">
            <LogOut
              className="h-4.5 w-4.5 text-neutral-600 group-hover:text-rose-400 transition-colors"
              strokeWidth={1.5}
            />
            <span className="flex-1 text-left">Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { isOpen, onClose } = useMobileMenu();

  // Handle mobile body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // STRICT ISOLATION: Use role to determine navigation, NOT pathname
  // Admins ONLY see admin navigation and cannot access user routes
  const role = user?.publicMetadata?.role as string | undefined;
  const isAdmin = role === "admin";

  // Admins see ONLY admin items, regular users see user items
  const currentItems = isAdmin ? adminNavItems : userNavItems;
  const sectionLabel = isAdmin ? "Admin" : "Navigation";

  if (!isLoaded) return null;

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={clsx(
          "hidden lg:flex fixed left-0 top-0 bottom-0 w-[280px] flex-col border-r border-white/5 bg-[#08090A] z-40",
          className,
        )}
      >
        <SidebarContent
          pathname={pathname}
          onClose={onClose}
          isAdmin={isAdmin}
          sectionLabel={sectionLabel}
          currentItems={currentItems}
        />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="absolute left-0 top-0 bottom-0 w-[300px] max-w-[85%] bg-[#08090A] border-r border-white/10 shadow-2xl flex flex-col"
            >
              <SidebarContent
                pathname={pathname}
                onClose={onClose}
                isAdmin={isAdmin}
                sectionLabel={sectionLabel}
                currentItems={currentItems}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
