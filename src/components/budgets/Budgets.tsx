"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Settings2,
  AlertCircle,
  Utensils,
  Plane,
  ShoppingBag,
  ChevronRight,
  TrendingUp,
  Info,
  Car,
  CircleDollarSign,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addBudget } from "@/actions/budgets";
import { Toast, ToastType } from "../ui/Toast";

// Category configuration for icons
const categoryIcons: Record<string, any> = {
  Travel: Plane,
  "Travel & Leisure": Plane,
  Dining: Utensils,
  "Dining & Culinary": Utensils,
  Investment: TrendingUp,
  Auto: Car,
  "Apparel & Goods": ShoppingBag,
};
const DefaultIcon = CircleDollarSign;

const BudgetItem = ({ name, transactions, spent, limit, warning }: any) => {
  const percentage = (spent / limit) * 100;
  const isHighVelocity = percentage > 85 || warning;
  const isExceeded = percentage >= 100;

  const Icon = categoryIcons[name] || DefaultIcon;

  return (
    <div
      className={`group relative flex flex-col gap-4 rounded-2xl border ${isExceeded ? "border-rose-500/40 bg-rose-500/10" : isHighVelocity ? "border-amber-500/20 bg-amber-500/5" : "border-white/5 bg-white/5"} p-5 transition-all hover:bg-white/10`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-neutral-400 group-hover:text-white">
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{name}</h3>
            <p className="text-xs text-neutral-500">{transactions} Transactions</p>
            {isExceeded && (
              <p className="mt-1 text-[10px] font-medium text-rose-400 uppercase tracking-wider">
                Budget Exceeded
              </p>
            )}
            {!isExceeded && warning && (
              <p className="mt-1 text-[10px] font-medium text-amber-400 uppercase tracking-wider">
                High Velocity
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">
            ${spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
            <span className="text-neutral-500 font-normal">
              / ${limit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </p>
        </div>
      </div>

      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full ${isExceeded ? "bg-rose-500" : isHighVelocity ? "bg-amber-500" : "bg-emerald-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-end">
        <span
          className={`text-[10px] font-bold ${isExceeded ? "text-rose-400" : isHighVelocity ? "text-amber-500" : "text-emerald-500"}`}
        >
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default function Budgets({
  initialBudgets = [],
  totalLimit = 0,
  totalSpent = 0,
  velocityDiff = 0,
  currentDay = 1,
  daysInMonth = 30,
}: any) {
  const router = useRouter();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "adjust">("create");
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ isVisible: true, message, type });
  };

  const totalPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  // Find top overspending
  let worstCategory: any = null;
  let worstDiff = -100;
  initialBudgets.forEach((b: any) => {
    const p = b.spent / b.limit;
    const monthP = currentDay / daysInMonth;
    if (p - monthP > worstDiff && p - monthP > 0) {
      worstDiff = p - monthP;
      worstCategory = b;
    }
  });

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await addBudget({ category, amount: Number(amount) });
      if (result.success) {
        setIsModalOpen(false);
        setCategory("");
        setAmount("");
        router.refresh();
        showToast("Budget allocation synchronized successfully", "success");
      } else {
        throw new Error("Failed to save budget");
      }
    } catch (err) {
      console.error(err);
      showToast("Critical error during budget synchronization", "error");
    } finally {
      setLoading(false);
    }
  };

  const openAdjustModal = (cat?: string, amt?: number) => {
    setModalMode("adjust");
    if (cat) {
      setCategory(cat);
      setAmount(amt?.toString() || "");
    } else {
      setCategory("");
      setAmount("");
    }
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCategory("");
    setAmount("");
    setIsModalOpen(true);
  };

  return (
    <div className="w-full space-y-10 py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">
            Monthly Allocation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            {currentMonth} Budgets
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-neutral-400">
            Your aggregate spending is currently{" "}
            <span
              className={`font-medium ${velocityDiff > 0 ? "text-rose-400" : "text-emerald-400"}`}
            >
              {Math.abs(Math.round(velocityDiff))}% {velocityDiff > 0 ? "above" : "below"}
            </span>{" "}
            projected velocity for this period.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAdjustModal()}
            disabled={initialBudgets.length === 0}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Settings2 className="h-4 w-4" /> Adjust Limits
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={3} /> New Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#121212] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Total Discretionary Spend
              </p>
              <h2 className="mt-2 text-5xl font-bold text-white">
                ${Math.floor(totalSpent).toLocaleString()}
                <span className="text-2xl text-neutral-500">
                  .{(totalSpent % 1).toFixed(2).substring(2)}
                </span>
              </h2>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-right">
              <p className="text-[10px] font-bold text-emerald-500 uppercase">
                {Math.round(totalPercentage)}%{" "}
                <span className="text-neutral-500 text-[8px]">
                  of ${(totalLimit / 1000).toFixed(1)}k limit
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              <span>
                Day {currentDay} of {daysInMonth}
              </span>
              <span>
                $
                {Math.max(0, totalLimit - totalSpent).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                remaining
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totalPercentage, 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        {worstCategory ? (
          <div className="rounded-3xl border border-rose-500/20 bg-[#121212] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle className="h-24 w-24 text-rose-500" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  {worstCategory.category} Velocity High
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Your '{worstCategory.category}' category is currently projected to exceed its
                  allocation based on recent spending. You've spent{" "}
                  {Math.round((worstCategory.spent / worstCategory.limit) * 100)}% of the limit in{" "}
                  {((currentDay / daysInMonth) * 100).toFixed(0)}% of the month time.
                </p>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold text-emerald-400 transition-colors hover:text-emerald-300">
                Review Details <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-emerald-500/20 bg-[#121212] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="h-24 w-24 text-emerald-500" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Looking Good!</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  All category allocations are well within projected bounds. Keep up the good work
                  managing your resources.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
            Active Allocations
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {initialBudgets.length === 0 && (
            <p className="text-sm text-neutral-500 text-center py-8">
              No budgets set for this month. Create your first category!
            </p>
          )}
          {initialBudgets.map((b: any) => {
            const p = b.spent / b.limit;
            const monthP = currentDay / daysInMonth;
            const warning = p > monthP * 1.15 && p > 0.5;

            return (
              <div key={b.category} className="group relative">
                <BudgetItem
                  name={b.category}
                  transactions={b.transactionsCount}
                  spent={b.spent}
                  limit={b.limit}
                  warning={warning}
                />
                <button
                  onClick={() => openAdjustModal(b.category, b.limit)}
                  className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-emerald-400"
                >
                  Edit Limit
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#161616] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <h2 className="text-xl font-bold text-white">
                  {modalMode === "create" ? "Establish Budget" : "Adjust Limit"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddBudget} className="p-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Category
                    </label>
                    {modalMode === "adjust" && initialBudgets.length > 0 ? (
                      <select
                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={category}
                        onChange={(e) => {
                          const selectedCategory = e.target.value;
                          setCategory(selectedCategory);
                          const b = initialBudgets.find(
                            (b: any) => b.category === selectedCategory,
                          );
                          if (b) {
                            setAmount(b.limit.toString());
                          } else {
                            setAmount("");
                          }
                        }}
                        required
                      >
                        <option value="" disabled className="bg-[#161616]">
                          Select Category
                        </option>
                        {initialBudgets.map((b: any) => (
                          <option key={b.category} value={b.category} className="bg-[#161616]">
                            {b.category}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Travel, Dining, Auto"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        disabled={modalMode === "adjust"}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Monthly Limit
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-8 pr-4 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Budget"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
