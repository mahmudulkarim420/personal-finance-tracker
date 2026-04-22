"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRole } from "@/hooks/use-role";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useMobileMenu } from "@/context/MobileMenuContext";
import clsx from "clsx";

// Lazy-load heavy components
const CommandSearch = dynamic(() => import("@/components/CommandSearch"), { ssr: false });
const NotificationDropdown = dynamic(() => import("@/components/NotificationDropdown"), {
  ssr: false,
});

export default function Header() {
  const { isLoaded, user } = useUser();
  const { role, isLoaded: isRoleLoaded } = useRole();
  const { toggle: toggleMobileMenu } = useMobileMenu();
  const pathname = usePathname();

  const sidebarLeft = "lg:left-[300px]";

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setNotifOpen(false);
  }, []);

  const toggleNotif = useCallback(() => {
    setNotifOpen((prev) => !prev);
    setSearchOpen(false);
  }, []);

  return (
    <>
      <div
        className={clsx(
          "fixed transition-all duration-700 ease-in-out z-50",
          "top-4 left-4 right-4 h-16",
          "lg:top-6 lg:right-8 lg:h-20",
          sidebarLeft,
        )}
      >
        {/* Inner Max-Width Container - Aligns with main content max-width */}
        <div className="mx-auto w-full h-full max-w-[1600px]">
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className={clsx(
              "flex h-full items-center justify-between",
              "rounded-[24px] sm:rounded-[28px] border border-base-300 bg-base-100 px-4 md:px-6 lg:px-8",
              "shadow-sm backdrop-blur-md",
              "hover:border-primary/20 transition-colors duration-500",
            )}
          >
            <div className="flex items-center gap-4">
              {/* Mobile Menu Trigger */}
              <button
                onClick={toggleMobileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-base-200 text-accent/60 hover:text-primary hover:bg-base-300 lg:hidden transition-all duration-300 shadow-sm"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Title - Visible on Desktop or small screens without search */}
              <h1 className="hidden sm:block text-[14px] font-black text-neutral tracking-widest uppercase opacity-80">
                Vault
              </h1>
            </div>

            {/* Search trigger - Fluid width */}
            <button
              id="cmd-search-trigger"
              onClick={openSearch}
              className="flex flex-1 mx-2 sm:mx-6 items-center gap-2 bg-base-200 border border-base-300 rounded-xl px-4 py-2 max-w-md group hover:border-primary/50 transition-all duration-300 text-left shadow-inner"
              aria-label="Open command search (Ctrl+K)"
            >
              <Search
                className="w-4 h-4 text-accent/60 shrink-0 group-hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
              <span className="text-[13px] text-accent flex-1 truncate font-black">
                {role === "admin" ? "Search system…" : "Search transactions…"}
              </span>
              <kbd className="hidden md:flex text-[10px] text-accent/60 bg-base-100 border border-base-300 rounded-md px-1.5 py-0.5 font-mono shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1.5 sm:gap-1.5 border-r border-base-300 pr-2 sm:pr-4 mr-1 sm:mr-2">
                {/* Bell */}
                <div className="relative">
                  <button
                    ref={bellRef}
                    id="notification-bell"
                    onClick={toggleNotif}
                    className="relative p-2.5 rounded-xl text-accent/60 hover:text-primary hover:bg-primary/5 transition-all duration-300 group"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4.5 h-4.5" strokeWidth={1.5} />
                    {hasUnread && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-base-100 animate-pulse" />
                    )}
                  </button>

                  <NotificationDropdown
                    anchorRef={bellRef}
                    isOpen={notifOpen}
                    onClose={() => setNotifOpen(false)}
                    onUnreadChange={setHasUnread}
                  />
                </div>

                <button
                  className="hidden sm:flex p-2.5 rounded-xl text-accent/60 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                  aria-label="Help"
                >
                  <HelpCircle className="w-4.5 h-4.5" strokeWidth={1.5} />
                </button>
              </div>

              {isLoaded ? (
                <div className="flex items-center gap-3">
                  <div className="hidden xl:flex flex-col items-end leading-tight">
                    <span className="text-[13px] font-black text-neutral">
                      {user?.fullName || user?.username || "Guest"}
                    </span>
                    <span className="text-[10px] text-primary font-black uppercase tracking-widest">
                      {isRoleLoaded ? (role === "admin" ? "Admiral" : "Standard") : "..."}
                    </span>
                  </div>
                  <div className="relative ">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-8 h-8 rounded-full border border-base-300",
                          userButtonTrigger: "focus:shadow-none focus:outline-none ring-0",
                          userButtonPopoverCard:
                            "bg-base-100 border border-base-300 shadow-2xl rounded-2xl overflow-hidden",
                          userButtonPopoverActionButtonText: "text-accent font-black",
                          userButtonPopoverActionButton: "hover:bg-base-200 transition-colors",
                          userButtonPopoverFooter: "hidden",
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />
              )}
            </div>
          </motion.header>
        </div>
      </div>

      {/* Command Search */}
      <CommandSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        role={role ?? undefined}
      />
    </>
  );
}
