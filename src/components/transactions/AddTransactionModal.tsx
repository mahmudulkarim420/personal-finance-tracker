"use client";

import React, { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionFormData } from "@/schema/transaction";
import { addTransaction } from "@/actions/addTransaction";
import clsx from "clsx";

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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 px-0 sm:px-4 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-lg h-[90vh] sm:h-auto overflow-y-auto rounded-t-[32px] sm:rounded-[32px] border border-white/10 bg-[#08090A]/95 p-6 shadow-2xl sm:p-10 ring-1 ring-white/5">
        
        {/* Mobile Handle */}
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/10 sm:hidden" />

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Manual Injection</h2>
            <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Transaction Manifest</p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-xl p-2.5 text-neutral-500 transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-400 border border-rose-500/20 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-1">Capital Amount</label>
              <div className="relative group">
                <span className={clsx(
                  "absolute left-4 top-1/2 -translate-y-1/2 font-bold transition-colors duration-300",
                  amountValue > 0 ? "text-emerald-500" : amountValue < 0 ? "text-rose-400" : "text-neutral-500"
                )}>$</span>
                <input 
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                  className={clsx(
                    "w-full rounded-2xl border border-white/5 bg-white/[0.03] py-4 pl-10 pr-4 outline-none transition-all duration-300 focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/40 font-semibold tabular-nums shadow-inner",
                    amountValue > 0 ? "text-emerald-400" : amountValue < 0 ? "text-rose-400" : "text-white"
                  )}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-[10px] text-rose-400 font-bold ml-1">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-1">Value Date</label>
              <div className="relative">
                <input 
                  type="date"
                  {...register("date")}
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-white font-semibold outline-none transition-all duration-300 focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/40 shadow-inner [color-scheme:dark]"
                />
              </div>
              {errors.date && <p className="text-[10px] text-rose-400 font-bold ml-1">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-1">Flow Description</label>
            <input 
              type="text"
              {...register("description")}
              className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-white font-semibold placeholder-neutral-700 outline-none transition-all duration-300 focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/40 shadow-inner"
              placeholder="Source or destination details..."
            />
            {errors.description && <p className="text-[10px] text-rose-400 font-bold ml-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-1">Asset Category</label>
              <select 
                {...register("category")}
                className="w-full appearance-none rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-white outline-none transition-all duration-300 focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/40 shadow-inner"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#08090A]">{cat}</option>)}
              </select>
              {errors.category && <p className="text-[10px] text-rose-400 font-bold ml-1">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-1">Operating Account</label>
              <select 
                {...register("account")}
                className="w-full appearance-none rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-white outline-none transition-all duration-300 focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/40 shadow-inner"
              >
                {ACCOUNTS.map(acc => <option key={acc} value={acc} className="bg-[#08090A]">{acc}</option>)}
              </select>
              {errors.account && <p className="text-[10px] text-rose-400 font-bold ml-1">{errors.account.message}</p>}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isPending}
              className="group relative w-full overflow-hidden rounded-2xl bg-emerald-500 py-4.5 text-sm font-black text-black transition-all duration-300 hover:bg-emerald-400 disabled:opacity-50 active:scale-[0.98] shadow-[0_12px_32px_rgba(16,185,129,0.3)]"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Syncing Ledger...</span>
                </div>
              ) : (
                <span className="tracking-widest uppercase">Commit Transaction</span>
              )}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
