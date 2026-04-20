"use client";

import React, { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionFormData } from "@/schema/transaction";
import { addTransaction } from "@/actions/addTransaction";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ["Dining", "Dividend Yield", "Real Estate", "Travel", "Art & Collectibles", "Salary", "Utilities"];
const ACCOUNTS = ["Platinum Reserve", "Brokerage *8821", "Operating Acct"];

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      category: CATEGORIES[0],
      account: ACCOUNTS[0],
      date: new Date().toISOString().split("T")[0],
    },
  });

  const amountValue = watch("amount");

  const onSubmit = (data: TransactionFormData) => {
    setErrorMsg("");
    startTransition(async () => {
      const result = await addTransaction(data);
      if (result.success) {
        reset();
        onClose();
      } else {
        setErrorMsg(result.error || "Something went wrong adding transaction");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#121212]/95 p-6 shadow-2xl sm:p-8">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Add Transaction</h2>
          <button 
            onClick={onClose} 
            className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${
                  amountValue > 0 ? "text-emerald-500" : amountValue < 0 ? "text-red-400" : "text-neutral-400"
                }`}>$</span>
                <input 
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                  className={`w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-8 pr-4 outline-none transition-colors focus:border-emerald-500/50 ${
                    amountValue > 0 ? "text-emerald-400" : amountValue < 0 ? "text-red-400" : "text-white"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-[10px] text-red-400">{errors.amount.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Date</label>
              <input 
                type="date"
                {...register("date")}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-emerald-500/50 [color-scheme:dark]"
              />
              {errors.date && <p className="text-[10px] text-red-400">{errors.date.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Description</label>
            <input 
              type="text"
              {...register("description")}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-neutral-600 outline-none transition-colors focus:border-emerald-500/50"
              placeholder="e.g., Grocery Shopping..."
            />
            {errors.description && <p className="text-[10px] text-red-400">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</label>
              <div className="relative">
                <select 
                  {...register("category")}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-emerald-500/50"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              {errors.category && <p className="text-[10px] text-red-400">{errors.category.message}</p>}
            </div>

            {/* Account */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Account</label>
              <div className="relative">
                <select 
                  {...register("account")}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-emerald-500/50"
                >
                  {ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                </select>
              </div>
              {errors.account && <p className="text-[10px] text-red-400">{errors.account.message}</p>}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full flex items-center justify-center rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Transaction"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
