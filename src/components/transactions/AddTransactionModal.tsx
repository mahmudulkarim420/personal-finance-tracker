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
  budgetCategories?: string[];
}

const ACCOUNTS = ["Platinum Reserve", "Brokerage *8821", "Operating Acct"];

export default function AddTransactionModal({ isOpen, onClose, budgetCategories = [] }: AddTransactionModalProps) {
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
      category: budgetCategories[0] || "General",
      account: ACCOUNTS[0],
      date: new Date().toISOString().split("T")[0],
      type: "EXPENSE",
    },
  });

  const amountValue = watch("amount");
  const typeValue = watch("type");
  const { setValue } = useForm<TransactionFormData>(); // for manual sets if needed

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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-neutral/40 px-0 sm:px-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg h-[90vh] sm:h-auto overflow-y-auto rounded-t-[32px] sm:rounded-[32px] border border-base-300 bg-base-100 p-6 shadow-2xl sm:p-10">
        
        {/* Mobile Handle */}
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-base-300 sm:hidden" />

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-neutral tracking-tight">Manual Injection</h2>
            <p className="text-xs text-accent font-black mt-1 uppercase tracking-widest opacity-60">Transaction Manifest</p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-xl p-2.5 text-accent/60 transition-all duration-300 hover:bg-base-200 hover:text-neutral"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-rose-100/50 p-4 text-sm text-rose-700 border border-rose-200 font-black">
            {errorMsg}
          </div>
        )}

        {/* Type Toggle */}
        <div className="mb-8 flex p-1.5 bg-base-200 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => reset({ ...watch(), type: "EXPENSE" })}
            className={clsx(
              "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
              typeValue === "EXPENSE" ? "bg-rose-600 text-white shadow-sm" : "text-accent/60 hover:text-neutral"
            )}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => reset({ ...watch(), type: "INCOME" })}
            className={clsx(
              "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
              typeValue === "INCOME" ? "bg-green-600 text-white shadow-sm" : "text-accent/60 hover:text-neutral"
            )}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 ml-1">Capital Amount</label>
              <div className="relative group">
                <span className={clsx(
                  "absolute left-4 top-1/2 -translate-y-1/2 font-black transition-colors duration-300",
                  amountValue > 0 ? "text-green-700" : amountValue < 0 ? "text-rose-700" : "text-accent/40"
                )}>$</span>
                <input 
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                  className={clsx(
                    "w-full rounded-2xl border border-base-300 bg-base-200 py-4 pl-10 pr-4 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 focus:border-primary font-black tabular-nums shadow-sm",
                    amountValue > 0 ? "text-green-700" : amountValue < 0 ? "text-rose-700" : "text-neutral"
                  )}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-[10px] text-rose-600 font-bold ml-1">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 ml-1">Value Date</label>
              <div className="relative">
                <input 
                  type="date"
                  {...register("date")}
                  className="w-full rounded-2xl border border-base-300 bg-base-200 px-5 py-4 text-neutral font-black outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm"
                />
              </div>
              {errors.date && <p className="text-[10px] text-rose-600 font-bold ml-1">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 ml-1">Flow Description</label>
            <input 
              type="text"
              {...register("description")}
              className="w-full rounded-2xl border border-base-300 bg-base-200 px-5 py-4 text-neutral font-black placeholder-accent/40 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm"
              placeholder="Source or destination details..."
            />
            {errors.description && <p className="text-[10px] text-rose-700 font-black ml-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 ml-1">Asset Category</label>
              <select 
                {...register("category")}
                className="w-full appearance-none rounded-2xl border border-base-300 bg-base-200 px-5 py-4 text-sm font-black text-neutral outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm"
              >
                {budgetCategories.length > 0 ? (
                  budgetCategories.map(cat => <option key={cat} value={cat} className="bg-base-200">{cat}</option>)
                ) : (
                  <option value="General" className="bg-base-200">General (Add a budget first)</option>
                )}
              </select>
              {errors.category && <p className="text-[10px] text-rose-600 font-bold ml-1">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 ml-1">Operating Account</label>
              <select 
                {...register("account")}
                className="w-full appearance-none rounded-2xl border border-base-300 bg-base-200 px-5 py-4 text-sm font-black text-neutral outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm"
              >
                {ACCOUNTS.map(acc => <option key={acc} value={acc} className="bg-base-200">{acc}</option>)}
              </select>
              {errors.account && <p className="text-[10px] text-rose-600 font-bold ml-1">{errors.account.message}</p>}
            </div>
          </div>

          <div className="pt-4">
             <button 
              type="submit" 
              disabled={isPending}
              className="group relative w-full overflow-hidden rounded-2xl bg-primary py-4.5 text-sm font-black text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 active:scale-[0.98] shadow-sm"
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
