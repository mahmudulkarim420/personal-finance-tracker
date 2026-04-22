"use client";

import { useEffect, useRef, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Settings,
  TrendingUp,
  TrendingDown,
  Loader2,
  Hash,
  Command,
  Shield,
  Users,
} from "lucide-react";
import { searchAll, type SearchResult } from "@/actions/search";

const PAGE_ICONS: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard,
  Transactions: ArrowLeftRight,
  Budgets: PieChart,
  Goals: Target,
  Settings: Settings,
  // Admin pages
  "Admin Dashboard": Shield,
  "User Management": Users,
};

function formatAmount(amount: number, type?: string) {
  const sign = type === "INCOME" ? "+" : "-";
  return `${sign}$${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
  role?: string;
}

export default function CommandSearch({ isOpen, onClose, role }: CommandSearchProps) {
  const isAdmin = role === "admin";
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search effect — debounced
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await searchAll(query);
        if (res.success && res.data) {
          setResults(res.data);
          setSelectedIndex(0);
        }
      });
    }, 220);
    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      if (item.href) {
        router.push(item.href);
      }
      onClose();
    },
    [router, onClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const pages = results.filter((r) => r.type === "page");
  const transactions = results.filter((r) => r.type === "transaction");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-neutral/40 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            key="palette"
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-[15%] z-50 w-full max-w-[560px] -translate-x-1/2 overflow-hidden rounded-[20px] border border-base-300 bg-white shadow-2xl"
          >
            {/* Search input row */}
            <div className="flex items-center gap-3 border-b border-base-200 px-4 py-3.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-base-300 bg-base-200">
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-accent/60" />
                ) : (
                  <Search className="h-3.5 w-3.5 text-accent/60" />
                )}
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isAdmin
                    ? "Search admin pages…"
                    : "Search transactions, pages…"
                }
                className="flex-1 bg-transparent text-[14px] font-black text-neutral placeholder:text-accent/40 outline-none"
              />
              <kbd className="hidden text-[10px] text-accent/60 bg-base-200 border border-base-300 rounded px-1.5 py-0.5 font-mono sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <ul
              ref={listRef}
              className="max-h-[380px] overflow-y-auto overscroll-contain py-2 custom-scrollbar"
            >
               {results.length === 0 && !isPending && (
                <li className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <Hash className="h-8 w-8 text-base-300" strokeWidth={1.2} />
                  <p className="text-sm text-accent/60 font-black">No results for &ldquo;{query}&rdquo;</p>
                </li>
              )}

              {/* Pages group */}
              {pages.length > 0 && (
                <>
                   <li className="px-4 pb-1 pt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">
                      Pages
                    </span>
                  </li>
                  {pages.map((item) => {
                    const idx = results.indexOf(item);
                    const Icon = PAGE_ICONS[item.label] ?? LayoutDashboard;
                    const isSelected = idx === selectedIndex;
                    return (
                      <li key={item.id}>
                        <button
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => handleSelect(item)}
                           className={`flex w-full items-center gap-3 rounded-xl mx-1.5 px-3 py-2.5 text-left transition-all duration-100 ${
                            isSelected
                              ? "bg-primary/5 text-primary"
                              : "text-accent/60 hover:bg-base-200"
                          }`}
                          style={{ width: "calc(100% - 12px)" }}
                        >
                          <div
                             className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                              isSelected
                                ? "border-primary/20 bg-primary/10"
                                : "border-base-300 bg-base-200"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </div>
                          <span className="text-[13px] font-black">{item.label}</span>
                          {isSelected && (
                            <kbd className="ml-auto text-[10px] text-primary bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5 font-mono">
                              ↵
                            </kbd>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </>
              )}

              {/* Transactions group */}
              {transactions.length > 0 && (
                <>
                   <li className="px-4 pb-1 pt-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">
                      Transactions
                    </span>
                  </li>
                  {transactions.map((item) => {
                    const idx = results.indexOf(item);
                    const isSelected = idx === selectedIndex;
                    const isIncome = item.txType === "INCOME";
                    return (
                      <li key={item.id}>
                        <button
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => handleSelect(item)}
                           className={`flex w-full items-center gap-3 rounded-xl mx-1.5 px-3 py-2.5 text-left transition-all duration-100 ${
                            isSelected
                              ? "bg-base-200 text-neutral"
                              : "text-accent/60 hover:bg-base-200"
                          }`}
                          style={{ width: "calc(100% - 12px)" }}
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                              isIncome
                                ? "border-green-100 bg-green-50"
                                : "border-rose-100 bg-rose-50"
                            }`}
                          >
                            {isIncome ? (
                              <TrendingUp className="h-3.5 w-3.5 text-green-600" strokeWidth={1.5} />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5 text-rose-600" strokeWidth={1.5} />
                            )}
                          </div>
                           <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-[13px] font-black text-neutral">
                              {item.label}
                            </span>
                            {item.sublabel && (
                              <span className="text-[11px] text-accent/60 font-black">{item.sublabel}</span>
                            )}
                          </div>
                          {item.amount !== undefined && (
                             <span
                              className={`shrink-0 text-[12px] font-black tabular-nums ${
                                isIncome ? "text-green-600" : "text-rose-600"
                              }`}
                            >
                              {formatAmount(item.amount, item.txType)}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>

            {/* Footer hint */}
             <div className="flex items-center gap-4 border-t border-base-200 px-4 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-accent/60 font-black">
                <Command className="h-3 w-3" />
                <span>K to open</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-accent/60 font-black">
                <span>↑↓ navigate</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-accent/60 font-black">
                <span>↵ select</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
