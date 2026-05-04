"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { formatUSD, formatRelativeTime, getBaseExplorerUrl, shortenTxHash } from "@/lib/utils";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  token: string;
  txHash?: string | null;
  status: string;
  createdAt: string;
  note?: string | null;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  isLoading?: boolean;
}

const TypeIcon = ({ type }: { type: string }) => {
  if (type === "deposit")
    return (
      <div className="p-2 rounded-xl bg-blue-500/10">
        <ArrowDownToLine size={14} className="text-blue-400" />
      </div>
    );
  if (type === "withdrawal")
    return (
      <div className="p-2 rounded-xl bg-orange-500/10">
        <ArrowUpFromLine size={14} className="text-orange-400" />
      </div>
    );
  return (
    <div className="p-2 rounded-xl bg-emerald-500/10">
      <TrendingUp size={14} className="text-emerald-400" />
    </div>
  );
};

export default function RecentTransactions({
  transactions,
  isLoading,
}: RecentTransactionsProps) {
  return (
    <div className="glass rounded-2xl border border-white/5">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-semibold text-white">Recent Transactions</h3>
        <Link
          href="/dashboard/transactions"
          className="text-xs text-primary hover:text-primary-light transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="divide-y divide-white/5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
            </div>
          ))
        ) : !transactions?.length ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={20} className="text-gray-500" />
            </div>
            <p className="text-sm text-gray-400 font-medium">
              No transactions yet
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Make your first deposit to get started
            </p>
          </div>
        ) : (
          transactions.slice(0, 5).map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 flex items-center gap-3 hover:bg-white/2 transition-colors"
            >
              <TypeIcon type={tx.type} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white capitalize">
                    {tx.type === "withdrawal" ? "Withdrawal" : tx.type === "deposit" ? "Deposit" : "Profit"}
                  </p>
                  {tx.txHash && (
                    <a
                      href={getBaseExplorerUrl(tx.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {tx.txHash ? shortenTxHash(tx.txHash) : formatRelativeTime(tx.createdAt)}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={`text-sm font-semibold ${
                    tx.type === "deposit"
                      ? "text-blue-400"
                      : tx.type === "withdrawal"
                      ? "text-orange-400"
                      : "text-emerald-400"
                  }`}
                >
                  {tx.type === "withdrawal" ? "-" : "+"}
                  {formatUSD(tx.amount)}
                </p>
                <div className="mt-1">
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
