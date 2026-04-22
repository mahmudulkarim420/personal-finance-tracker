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
      className={`group relative flex flex-col gap-4 rounded-2xl border ${isExceeded ? "border-rose-200 bg-rose-50" : isHighVelocity ? "border-orange-200 bg-orange-50" : "border-base-300 bg-white"} p-5 transition-all hover:bg-base-200 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-accent/60 group-hover:text-accent shadow-inner">
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-black text-neutral">{name}</h3>
            <p className="text-xs text-accent font-black opacity-60">{transactions} Transactions</p>
            {isExceeded && (
              <p className="mt-1 text-[10px] font-medium text-rose-400 uppercase tracking-wider">
                Budget Exceeded
              </p>
            )}
            {!isExceeded && warning && (
              <p className="mt-1 text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                High Velocity
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-neutral">
            ${spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
            <span className="text-accent/60 font-black">
              / ${limit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </p>
        </div>
      </div>

      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-base-200 shadow-inner">        <motion.div
          className={`h-full rounded-full ${isExceeded ? "bg-rose-600" : isHighVelocity ? "bg-orange-500" : "bg-primary"}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-end">
        <span
          className={`text-[10px] font-black ${isExceeded ? "text-rose-600" : isHighVelocity ? "text-orange-600" : "text-primary"}`}
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
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Monthly Allocation
          </p>
          <h1 className="text-4xl font-black tracking-tight text-neutral">
            {currentMonth} Budgets
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-accent font-black">
            Your aggregate spending is currently{" "}
            <span
              className={`font-black ${velocityDiff > 0 ? "text-rose-600" : "text-green-600"}`}
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
            className="flex items-center gap-2 rounded-xl border border-base-300 bg-white px-5 py-2.5 text-sm font-black text-accent transition-colors hover:bg-base-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Settings2 className="h-4 w-4" /> Adjust Limits
          </button>
           <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white transition-transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <Plus className="h-4 w-4" strokeWidth={3} /> New Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
         <div className="lg:col-span-2 rounded-3xl border border-base-300 bg-base-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-black text-accent/60 uppercase tracking-wider">
                Total Discretionary Spend
              </p>
              <h2 className="mt-2 text-5xl font-black text-neutral">
                ${Math.floor(totalSpent).toLocaleString()}
                <span className="text-2xl text-accent/40">
                  .{(totalSpent % 1).toFixed(2).substring(2)}
                </span>
              </h2>
            </div>
             <div className="rounded-xl border border-base-300 bg-white px-4 py-2 text-right shadow-sm">
              <p className="text-[10px] font-black text-primary uppercase">
                {Math.round(totalPercentage)}%{" "}
                <span className="text-accent/40 text-[8px]">
                  of ${(totalLimit / 1000).toFixed(1)}k limit
                </span>
              </p>
            </div>
          </div>

           <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-accent/60">
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
            <div className="h-2 w-full rounded-full bg-base-300 shadow-inner overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totalPercentage, 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        {worstCategory ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle className="h-24 w-24 text-rose-600" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-200 text-rose-600 shadow-sm">
                <AlertCircle className="h-6 w-6" />
              </div>
               <div className="space-y-2">
                <h3 className="text-lg font-black text-neutral">
                  {worstCategory.category} Velocity High
                </h3>
                <p className="text-sm text-accent leading-relaxed font-black opacity-70">
                  Your '{worstCategory.category}' category is currently projected to exceed its
                  allocation based on recent spending. You've spent{" "}
                  {Math.round((worstCategory.spent / worstCategory.limit) * 100)}% of the limit in{" "}
                  {((currentDay / daysInMonth) * 100).toFixed(0)}% of the month time.
                </p>
              </div>
               <button className="flex items-center gap-2 text-sm font-black text-primary transition-colors hover:text-neutral">
                Review Details <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-green-200 bg-green-50 p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="h-24 w-24 text-green-600" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-200 text-green-600 shadow-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
               <div className="space-y-2">
                <h3 className="text-lg font-black text-neutral">Looking Good!</h3>
                <p className="text-sm text-accent leading-relaxed font-black opacity-70">
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
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-accent/60">
            Active Allocations
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
           {initialBudgets.length === 0 && (
            <p className="text-sm text-accent/60 text-center py-8 font-black">
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
                  className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-accent/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary"
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
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/40 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md rounded-[28px] border border-base-300 bg-white shadow-2xl"
            >
               <div className="flex items-center justify-between border-b border-base-200 p-6">
                <h2 className="text-xl font-black text-neutral">
                  {modalMode === "create" ? "Establish Budget" : "Adjust Limit"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-accent/60 transition-colors hover:bg-base-200 hover:text-neutral"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddBudget} className="p-6">
                 <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-accent/60">
                      Category
                    </label>
                    {modalMode === "adjust" && initialBudgets.length > 0 ? (
                      <select
                        className="w-full rounded-xl border border-base-300 bg-base-200 px-4 py-3 text-sm font-black text-neutral focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
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
                        <option value="" disabled className="bg-white">
                          Select Category
                        </option>
                        {initialBudgets.map((b: any) => (
                          <option key={b.category} value={b.category} className="bg-white">
                            {b.category}
                          </option>
                        ))}
                      </select>
                    ) : (
                        <input
                          type="text"
                          className="w-full rounded-xl border border-base-300 bg-base-200 px-4 py-3 text-sm font-black text-neutral placeholder-accent/40 focus:border-neutral focus:outline-none focus:ring-4 focus:ring-neutral/10"
                          placeholder="e.g. Travel, Dining, Auto"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        disabled={modalMode === "adjust"}
                      />
                    )}
                  </div>

                   <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-accent/60">
                      Monthly Limit
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/60">
                        $
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="w-full rounded-xl border border-base-300 bg-base-200 py-3 pl-8 pr-4 text-sm font-black text-neutral placeholder-accent/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-inner"
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
                    className="rounded-xl px-5 py-2.5 text-sm font-black text-accent/60 transition-colors hover:bg-base-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-white transition-transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-sm"
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
