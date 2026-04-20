"use client";

import { useState, useEffect } from "react";
import { getTransactions, TransactionRecord } from "@/actions/getTransactions";

export type GroupedTransactions = {
  label: string;
  transactions: TransactionRecord[];
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<GroupedTransactions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getTransactions();
      if (res.success && res.data) {
        setTransactions(res.data);
        setGroupedTransactions(groupTransactionsByDate(res.data));
      } else {
        setError(res.error || "Failed to fetch transactions");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    groupedTransactions,
    isLoading,
    error,
    refresh: fetchTransactions,
  };
}

// Logic to group transactions properly into TODAY, YESTERDAY, OLDER
function groupTransactionsByDate(transactions: TransactionRecord[]): GroupedTransactions[] {
  if (!transactions.length) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, TransactionRecord[]> = {
    "TODAY": [],
    "YESTERDAY": [],
    "OLDER": [],
  };

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    txDate.setHours(0, 0, 0, 0);

    if (txDate.getTime() === today.getTime()) {
      groups["TODAY"].push(tx);
    } else if (txDate.getTime() === yesterday.getTime()) {
      groups["YESTERDAY"].push(tx);
    } else {
      // For older ones, we can also use direct dates like "OCT 20" but for this logic we use "OLDER"
      groups["OLDER"].push(tx);
    }
  });

  const finalGroups: GroupedTransactions[] = [];
  if (groups["TODAY"].length > 0) finalGroups.push({ label: "TODAY", transactions: groups["TODAY"] });
  if (groups["YESTERDAY"].length > 0) finalGroups.push({ label: "YESTERDAY", transactions: groups["YESTERDAY"] });
  if (groups["OLDER"].length > 0) finalGroups.push({ label: "OLDER", transactions: groups["OLDER"] });

  return finalGroups;
}
