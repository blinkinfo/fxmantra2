"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { History, ArrowDownToLine, ArrowUpFromLine, TrendingUp, ExternalLink, Filter } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import {
  formatUSD,
  formatDateTime,
  getBaseExplorerUrl,
  shortenTxHash,
} from "@/lib/utils";

type FilterType = "all" | "deposit" | "withdrawal" | "profit";

async function fetchTransactions(token: string, type?: string) {
  const url = type && type !== "all"
    ? `/api/transactions?type=${type}&limit=50`
    : "/api/transactions?limit=50";
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

const TypeIcon = ({ type }: { type: string }) => {
  if (type === "deposit")
    return <ArrowDownToLine size={14} className="text-blue-400" />;
  if (type === "withdrawal")
    return <ArrowUpFromLine size={14} className="text-orange-400" />;
  return <TrendingUp size={14} className="text-emerald-400" />;
};

const typeColors: Record<string, string> = {
  deposit: "text-blue-400",
  withdrawal: "text-orange-400",
  profit: "text-emerald-400",
};

export default function TransactionsPage() {
  const { getAccessToken } = usePrivy();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", filter],
    queryFn: async () => {
      const token = await getAccessToken();
      return fetchTransactions(token!, filter);
    },
    refetchInterval: 30000,
  });

  const transactions = data?.transactions ?? [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10">
            <History size={20} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Transaction History</h1>
            <p className="text-sm text-gray-400">
              All your deposits, withdrawals, and earnings
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-gray-500" />
        {(["all", "deposit", "withdrawal", "profit"] as FilterType[]).map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                filter === type
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "text-gray-500 border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-white/5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-32 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-20 bg-white/5 rounded animate-pulse ml-auto" />
                  <div className="h-3 w-16 bg-white/5 rounded animate-pulse ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <History size={22} className="text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-400">
              No transactions found
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {filter !== "all"
                ? `No ${filter} transactions yet`
                : "Make your first deposit to get started"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table header */}
            <div className="hidden sm:grid grid-cols-5 gap-4 px-5 py-3 border-b border-white/5 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="col-span-2">Transaction</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            <div className="divide-y divide-white/5">
              {transactions.map(
                (
                  tx: {
                    id: string;
                    type: string;
                    amount: number;
                    token: string;
                    txHash?: string;
                    status: string;
                    createdAt: string;
                    note?: string;
                  },
                  i: number
                ) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 sm:p-5 hover:bg-white/2 transition-colors"
                  >
                    {/* Mobile layout */}
                    <div className="sm:hidden flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          tx.type === "deposit"
                            ? "bg-blue-500/10"
                            : tx.type === "withdrawal"
                            ? "bg-orange-500/10"
                            : "bg-emerald-500/10"
                        }`}
                      >
                        <TypeIcon type={tx.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-white capitalize">
                            {tx.type}
                          </p>
                          <p
                            className={`text-sm font-bold ${typeColors[tx.type]}`}
                          >
                            {tx.type === "withdrawal" ? "-" : "+"}
                            {formatUSD(tx.amount)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDateTime(tx.createdAt)}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <StatusBadge status={tx.status} />
                          {tx.txHash && (
                            <a
                              href={getBaseExplorerUrl(tx.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-primary flex items-center gap-1 transition-colors"
                            >
                              {shortenTxHash(tx.txHash)}
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:grid grid-cols-5 gap-4 items-center">
                      <div className="col-span-2 flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            tx.type === "deposit"
                              ? "bg-blue-500/10"
                              : tx.type === "withdrawal"
                              ? "bg-orange-500/10"
                              : "bg-emerald-500/10"
                          }`}
                        >
                          <TypeIcon type={tx.type} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white capitalize">
                            {tx.type === "withdrawal"
                              ? "Withdrawal"
                              : tx.type === "deposit"
                              ? "Deposit"
                              : "Profit Credit"}
                          </p>
                          {tx.txHash ? (
                            <a
                              href={getBaseExplorerUrl(tx.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-primary flex items-center gap-1 transition-colors truncate"
                            >
                              {shortenTxHash(tx.txHash)}
                              <ExternalLink size={10} className="shrink-0" />
                            </a>
                          ) : (
                            <p className="text-xs text-gray-600">
                              {tx.note ?? "—"}
                            </p>
                          )}
                        </div>
                      </div>

                      <p
                        className={`text-sm font-bold ${typeColors[tx.type]}`}
                      >
                        {tx.type === "withdrawal" ? "-" : "+"}
                        {formatUSD(tx.amount)} {tx.token}
                      </p>

                      <StatusBadge status={tx.status} />

                      <p className="text-xs text-gray-400">
                        {formatDateTime(tx.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </>
        )}
      </div>

      {transactions.length > 0 && (
        <p className="text-center text-xs text-gray-600">
          Showing {transactions.length} transaction
          {transactions.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
