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
      case 'on-track': return 'bg-green-100/50 text-green-700 border-green-200';
      case 'review': return 'bg-rose-100/50 text-rose-700 border-rose-200';
      case 'funded': return 'bg-primary text-white font-black';
      case 'initiated': return 'bg-blue-100/50 text-blue-700 border-blue-200';
      default: return 'bg-base-300 text-accent/60';
    }
  };

  const Icon = categoryIcons[category] || DefaultIcon;

  return (
    <div className="group relative flex flex-col gap-6 rounded-3xl border border-base-300 bg-white p-6 transition-all hover:bg-base-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-base-200 text-accent/60 group-hover:text-accent transition-colors shadow-inner">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(statusType)}`}>
          {status}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-black text-neutral tracking-tight">{name}</h3>
        <p className="text-xs text-accent font-black opacity-60">{category}</p>
        {date && <p className="text-xs text-accent/40 font-black">Target: {new Date(date).toLocaleDateString()}</p>}
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <p className="text-2xl font-black text-neutral">${current.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-accent/40 font-black pb-1">/ ${target.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-200 shadow-inner">
          <motion.div 
            className={`h-full rounded-full transition-all duration-700 ${statusType === 'review' ? 'bg-rose-600' : 'bg-primary'}`} 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }} 
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-base-200 pt-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent/60">
          {statusType === 'funded' ? 'Status' : 'Options'}
        </p>
        {statusType === 'funded' ? (
          <p className="text-xs font-black text-green-700">
            Ready for deployment
          </p>
        ) : (
          <button 
            onClick={() => onAddFunds(id)}
            className="flex items-center gap-1 text-xs font-black text-primary transition-colors hover:text-neutral"
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
          <h1 className="text-4xl font-black tracking-tight text-neutral">Capital Allocation</h1>
          <p className="max-w-xl text-sm leading-relaxed text-accent font-black">
            Strategic reserves and future commitments across {initialGoals.length} active portfolios.
          </p>
        </div>
         <button 
          onClick={() => setIsAddGoalModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-white transition-transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
        >
          <Plus className="h-4 w-4" strokeWidth={3} /> Establish Goal
        </button>
      </div>

      {/* Strategic Reserves Summary Card */}
       <div className="rounded-3xl border border-base-300 bg-base-200 p-8 lg:p-10 shadow-sm">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">Total Strategic Reserves</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-5xl font-black text-neutral tracking-tighter">${Math.floor(totalCurrent).toLocaleString()}</h2>
              <span className="text-lg text-green-700 font-black">/ ${totalTarget.toLocaleString()} Target</span>
            </div>
          </div>

           <div className="space-y-6 lg:border-l lg:border-base-300 lg:pl-10">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-accent/60 uppercase">Aggregate Progress</p>
              <p className="text-xs font-black text-primary">{totalPercentage.toFixed(1)}%</p>
            </div>
            <div className="h-2 w-full rounded-full bg-base-300 overflow-hidden shadow-inner">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totalPercentage, 100)}%` }} 
                transition={{ duration: 1 }}
              />
            </div>
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-green-700">{onTrack + funded} Goals on track/funded</span>
              {review > 0 && <span className="text-rose-700">{review} Requires attention</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialGoals.length === 0 && (
          <p className="text-sm text-accent/60 font-black py-8 lg:col-span-3 text-center">No active goals found. Set up your first capital allocation goal.</p>
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
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/40 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md rounded-[28px] border border-base-300 bg-white shadow-2xl"
            >
               <div className="flex items-center justify-between border-b border-base-200 p-6">
                <h2 className="text-xl font-black text-neutral">Establish Goal</h2>
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="rounded-full p-2 text-accent/60 transition-colors hover:bg-base-200 hover:text-neutral"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="p-6">
                 <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-accent/60">
                      Goal Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-base-300 bg-base-200 px-4 py-3 text-sm font-black text-neutral placeholder-accent/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="e.g. New MacBook Pro"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                   <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-accent/60">
                      Target Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/60">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="w-full rounded-xl border border-base-300 bg-base-200 py-3 pl-8 pr-4 text-sm font-black text-neutral placeholder-accent/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-inner"
                        placeholder="0.00"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                   <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-accent/60">
                      Target Deadline
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-base-300 bg-base-200 px-4 py-3 text-sm font-black text-neutral outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
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
                    className="rounded-xl px-5 py-2.5 text-sm font-black text-accent/60 transition-colors hover:bg-base-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-white transition-transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-sm"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/40 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm rounded-[28px] border border-base-300 bg-white shadow-2xl"
            >
               <div className="flex items-center justify-between border-b border-base-200 p-6">
                <h2 className="text-xl font-black text-neutral">Add Funds</h2>
                <button
                  type="button"
                  onClick={() => setIsAddFundsModalOpen(false)}
                  className="rounded-full p-2 text-accent/60 transition-colors hover:bg-base-200 hover:text-neutral"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddFunds} className="p-6">
                 <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-accent/60">
                      Amount to Add
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/60">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="w-full rounded-xl border border-base-300 bg-base-200 py-3 pl-8 pr-4 text-sm font-black text-neutral placeholder-accent/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
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
                    className="rounded-xl px-4 py-2 text-sm font-black text-accent/60 transition-colors hover:bg-base-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-primary px-5 py-2 text-sm font-black text-white transition-transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-sm"
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