"use client";

import React, { useState } from 'react';
import { 
  Plus, Shield, Building, Plane, Car, 
  ChevronRight, TrendingUp, Target, ArrowUpRight,
  CircleDollarSign, X, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addGoal, addFundsToGoal } from '@/actions/goals';

const categoryIcons: Record<string, any> = {
  "Emergency Fund": Shield,
  "Downpayment": Building,
  "Travel": Plane,
  "Asset": Car,
};

const DefaultIcon = Target;

// Goal Card Component
const GoalCard = ({ 
  id,
  name, 
  category, 
  date, 
  current, 
  target, 
  onAddFunds
}: any) => {
  const percentage = target > 0 ? (current / target) * 100 : 100;
  
  let status = "On Track";
  let statusType = "on-track";

  if (percentage >= 100) {
    status = "Funded";
    statusType = "funded";
  } else if (percentage < 20) {
    status = "Initiated";
    statusType = "initiated";
  } else if (date && new Date(date) < new Date() && percentage < 100) {
    status = "Review";
    statusType = "review";
  }

  const getStatusStyles = (type: string) => {
    switch (type) {
      case 'on-track': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'review': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'funded': return 'bg-emerald-500 text-black font-bold';
      case 'initiated': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-white/5 text-neutral-400';
    }
  };

  const Icon = categoryIcons[category] || DefaultIcon;

  return (
    <div className="group relative flex flex-col gap-6 rounded-3xl border border-white/5 bg-[#121212]/50 p-6 backdrop-blur-sm transition-all hover:bg-[#121212] hover:border-white/10">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-neutral-400 group-hover:text-white transition-colors">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(statusType)}`}>
          {status}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white tracking-tight">{name}</h3>
        <p className="text-xs text-neutral-500">{category}</p>
        {date && <p className="text-xs text-neutral-600">Target: {new Date(date).toLocaleDateString()}</p>}
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-white">${current.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-neutral-500 pb-1">/ ${target.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div 
            className={`h-full rounded-full transition-all duration-700 ${statusType === 'review' ? 'bg-rose-500' : 'bg-emerald-500'}`} 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }} 
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {statusType === 'funded' ? 'Status' : 'Options'}
        </p>
        {statusType === 'funded' ? (
          <p className="text-xs font-bold text-emerald-500">
            Ready for deployment
          </p>
        ) : (
          <button 
            onClick={() => onAddFunds(id)}
            className="flex items-center gap-1 text-xs font-bold text-emerald-400 transition-colors hover:text-emerald-300"
          >
            <Plus className="h-3 w-3" /> Add Funds
          </button>
        )}
      </div>
    </div>
  );
};

export default function GoalsPage({ initialGoals = [] }: any) {
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Add Goal State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  // Add Funds State
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [fundAmount, setFundAmount] = useState('');

  const totalTarget = initialGoals.reduce((acc: number, g: any) => acc + g.targetAmount, 0);
  const totalCurrent = initialGoals.reduce((acc: number, g: any) => acc + g.currentAmount, 0);
  const totalPercentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const onTrack = initialGoals.filter((g: any) => (g.currentAmount / g.targetAmount) >= 0.2 && g.currentAmount < g.targetAmount).length;
  const funded = initialGoals.filter((g: any) => g.currentAmount >= g.targetAmount).length;
  const review = initialGoals.filter((g: any) => g.deadline && new Date(g.deadline) < new Date() && g.currentAmount < g.targetAmount).length;

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addGoal({ name, targetAmount: Number(targetAmount), deadline });
      setIsAddGoalModalOpen(false);
      setName('');
      setTargetAmount('');
      setDeadline('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFundsToGoal(selectedGoalId, Number(fundAmount));
      setIsAddFundsModalOpen(false);
      setFundAmount('');
      setSelectedGoalId('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openFundsModal = (id: string) => {
    setSelectedGoalId(id);
    setIsAddFundsModalOpen(true);
  };

  return (
    <div className="w-full space-y-10 py-6">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Capital Allocation</h1>
          <p className="max-w-xl text-sm leading-relaxed text-neutral-400">
            Strategic reserves and future commitments across {initialGoals.length} active portfolios.
          </p>
        </div>
        <button 
          onClick={() => setIsAddGoalModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <Plus className="h-4 w-4" strokeWidth={3} /> Establish Goal
        </button>
      </div>

      {/* Strategic Reserves Summary Card */}
      <div className="rounded-3xl border border-white/10 bg-[#121212] p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Total Strategic Reserves</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-5xl font-bold text-white tracking-tighter">${Math.floor(totalCurrent).toLocaleString()}</h2>
              <span className="text-lg text-emerald-500/80 font-medium">/ ${totalTarget.toLocaleString()} Target</span>
            </div>
          </div>

          <div className="space-y-6 lg:border-l lg:border-white/5 lg:pl-10">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-neutral-400">Aggregate Progress</p>
              <p className="text-xs font-bold text-emerald-500">{totalPercentage.toFixed(1)}%</p>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totalPercentage, 100)}%` }} 
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-emerald-500">{onTrack + funded} Goals on track/funded</span>
              {review > 0 && <span className="text-rose-400">{review} Requires attention</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialGoals.length === 0 && (
          <p className="text-sm text-neutral-500 py-8 lg:col-span-3 text-center">No active goals found. Set up your first capital allocation goal.</p>
        )}
        {initialGoals.map((g: any) => (
          <GoalCard 
            key={g.id}
            id={g.id}
            name={g.name}
            category={g.name.includes("Reserve") ? "Emergency Fund" : "Goal"}
            date={g.deadline}
            current={g.currentAmount}
            target={g.targetAmount}
            onAddFunds={openFundsModal}
          />
        ))}
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {isAddGoalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#161616] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <h2 className="text-xl font-bold text-white">Establish Goal</h2>
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="p-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Goal Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. New MacBook Pro"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Target Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-8 pr-4 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="0.00"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Target Deadline
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddGoalModalOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Create Goal"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Funds Modal */}
        {isAddFundsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#161616] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <h2 className="text-xl font-bold text-white">Add Funds</h2>
                <button
                  type="button"
                  onClick={() => setIsAddFundsModalOpen(false)}
                  className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddFunds} className="p-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Amount to Add
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-8 pr-4 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="0.00"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddFundsModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Add Funds"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}