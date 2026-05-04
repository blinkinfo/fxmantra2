"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  ArrowUpFromLine,
  Calendar,
  Loader2,
} from "lucide-react";
import { formatUSD, getNextWithdrawalDate, isWithdrawalDay, formatDate } from "@/lib/utils";

interface BalanceData {
  totalDeposited: number;
  totalEarned: number;
  availableProfit: number;
  totalWithdrawn: number;
  pendingDeposits: number;
}

interface StatsCardsProps {
  data?: BalanceData;
  isLoading?: boolean;
}

const cards = [
  {
    key: "totalDeposited",
    label: "Total Deposited",
    icon: DollarSign,
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    description: "Principal locked in vault",
  },
  {
    key: "totalEarned",
    label: "Total Earned",
    icon: TrendingUp,
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    description: "Cumulative 10%/mo yield",
  },
  {
    key: "availableProfit",
    label: "Available Profit",
    icon: ArrowUpFromLine,
    color: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    description: "Ready to withdraw",
  },
];

export default function StatsCards({ data, isLoading }: StatsCardsProps) {
  const nextWithdrawal = getNextWithdrawalDate();
  const canWithdraw = isWithdrawalDay();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const value = data?.[card.key as keyof BalanceData] ?? 0;

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-2xl p-5 bg-gradient-to-br ${card.color} border border-white/5 card-hover`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                  <Icon size={18} className={card.iconColor} />
                </div>
              </div>
              <div>
                {isLoading ? (
                  <div className="h-8 w-28 bg-white/10 rounded-lg animate-pulse mb-1" />
                ) : (
                  <p className="text-2xl font-bold text-white">
                    {formatUSD(value)}
                  </p>
                )}
                <p className="text-sm font-medium text-gray-400 mt-0.5">
                  {card.label}
                </p>
                <p className="text-xs text-gray-600 mt-1">{card.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`glass rounded-2xl p-5 border ${
          canWithdraw
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-white/5"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                canWithdraw ? "bg-emerald-500/15" : "bg-yellow-500/10"
              }`}
            >
              <Calendar
                size={18}
                className={canWithdraw ? "text-emerald-400" : "text-yellow-400"}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {canWithdraw
                  ? "Withdrawal Window Open!"
                  : "Next Withdrawal Date"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {canWithdraw
                  ? "Today is a withdrawal day — you can withdraw your profits now"
                  : `Available on ${formatDate(nextWithdrawal)} (1st, 11th & 21st each month)`}
              </p>
            </div>
          </div>
          {canWithdraw && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              Active Now
            </span>
          )}
          {!canWithdraw && (
            <span className="text-sm font-semibold text-white">
              {formatDate(nextWithdrawal)}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
