"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Download, Plus, Calendar, Layers, Tags, Search, SlidersHorizontal, 
  Utensils, TrendingUp, Building, Plane, Palette, ChevronDown, Receipt, Trash2
} from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';
import { useTransactions, groupTransactionsByDate } from '@/hooks/useTransactions';
import { deleteTransaction } from '@/actions/deleteTransaction';
import { Toast, ToastType } from '../ui/Toast';
import { AlertModal } from '../ui/AlertModal';

export default function LedgerTransactions() {
  const { transactions, isLoading, refresh } = useTransactions();
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Categories");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredGroupedTransactions = useMemo(() => {
    let filtered = transactions;
    
    if (selectedCategory !== "Categories") {
      filtered = filtered.filter(tx => tx.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(tx => 
        tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return groupTransactionsByDate(filtered);
  }, [transactions, selectedCategory, searchQuery]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = React.useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const result = await deleteTransaction(id);
      if (result.success) {
        refresh();
        showToast("Transaction successfully purged from ledger", "success");
      } else {
        showToast(result.error || "Failed to delete transaction", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Critical error during transaction deletion", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const CATEGORIES = ["Dining", "Dividend Yield", "Real Estate", "Travel", "Art & Collectibles", "Salary", "Utilities"];

  return (
    <div className="w-full relative min-h-[60vh]">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[10px] md:text-xs uppercase tracking-[0.4em] text-emerald-500/60 font-bold">Chronology</p>
          <h1 className="text-2xl md:text-4xl 2xl:text-5xl font-bold tracking-tight text-white mb-3">Wealth Ledger</h1>
          <p className="max-w-2xl text-sm md:text-base leading-relaxed text-neutral-500 font-medium">
            A comprehensive, high-fidelity mapping of all capital flows across your private ecosystem.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-6">
          <button 
            className="flex items-center justify-center gap-2 text-sm font-bold text-neutral-500 transition-all duration-300 hover:text-white group"
          >
            <Download className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" /> 
            <span className="tracking-wide">Export Manifest</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_24px_rgba(16,185,129,0.2)]"
          >
            <Plus className="h-4 w-4" strokeWidth={3} /> 
            <span className="tracking-tight">Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Filters (Simplified for brevity) */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3" ref={filterContainerRef}>
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('category')}
              className={`flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm transition-colors ${
                activeDropdown === 'category' ? 'bg-white/10 text-white' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Tags className="h-4 w-4 text-neutral-400" /> {selectedCategory}
              <ChevronDown className={`ml-1 h-3 w-3 text-neutral-500 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'category' && (
              <div className="absolute left-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl shadow-black/50">
                <div className="bg-black/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Filter by category</div>
                <div className="max-h-64 overflow-y-auto">
                  <button onClick={() => { setSelectedCategory("Categories"); setActiveDropdown(null); }} className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 text-neutral-300 hover:text-white">All Categories</button>
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }} className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 text-neutral-300 hover:text-white">{cat}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-11 pr-4 text-sm text-white outline-none transition-all focus:border-emerald-500/50 focus:bg-white/10"
          />
        </div>
      </div>

      {/* Dynamic Data Mapping and States */}
      <div className="space-y-8">
        {isLoading ? (
          // Skeleton Loader State
          <div className="space-y-4">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-3 w-32 rounded bg-white/10" />
                    <div className="h-2 w-24 rounded bg-white/5" />
                  </div>
                </div>
                <div className="h-4 w-20 rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : filteredGroupedTransactions.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-3xl bg-white/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-neutral-400 mb-4">
              <Receipt className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Matching Records</h3>
            <p className="text-neutral-400 max-w-sm mb-6 text-sm">
              Your search parameters returned zero results. Try adjusting your filters.
            </p>
          </div>
        ) : (
          // Mapped Data Display
          filteredGroupedTransactions.map((group) => (
            <div key={group.label}>
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                {group.label}
              </h2>
              <div className="flex flex-col gap-3">
                {group.transactions.map((tx) => {
                  const isIncome = tx.type === "INCOME";

                  return (
                    <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${isIncome ? "text-emerald-400" : "text-neutral-300"}`}>
                          {isIncome ? <TrendingUp className="h-5 w-5" strokeWidth={1.5} /> : <Utensils className="h-5 w-5" strokeWidth={1.5} />}
                        </div>
                        <div>
                          <h3 className="mb-0.5 text-sm font-medium text-white">{tx.description}</h3>
                          <p className="text-xs text-neutral-500">{tx.category} • {tx.account || "Cash"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-bold tracking-wider text-neutral-400">
                          <span className={`h-1.5 w-1.5 rounded-full ${tx.status === "PENDING" ? "bg-amber-400" : "bg-emerald-500"}`}></span> 
                          {tx.status}
                        </span>
                        <span className={`w-24 text-right text-sm font-medium ${isIncome ? "text-emerald-400" : "text-white"}`}>
                          {isIncome ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteAlert({ isOpen: true, id: tx.id });
                          }}
                          disabled={isDeleting === tx.id}
                          className="rounded-lg p-2 text-neutral-500 transition-all hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-50"
                        >
                          <Trash2 className={`h-4 w-4 ${isDeleting === tx.id ? "animate-pulse" : ""}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          refresh(); // Auto-refresh data when modal closes
        }} 
      />

      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <AlertModal 
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, id: null })}
        onConfirm={() => {
          if (deleteAlert.id) handleDelete(deleteAlert.id);
        }}
        title="Purge Transaction?"
        description="This action will permanently delete this record from your wealth ledger. This cannot be undone."
        confirmText="Purge Record"
        variant="danger"
      />
    </div>
  );
}