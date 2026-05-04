"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { formatAddress } from "@/lib/utils";
import { useWallets } from "@privy-io/react-auth";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import ProfitChart from "@/components/dashboard/profit-chart";

async function fetchBalance(token: string) {
  const res = await fetch("/api/balance", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch balance");
  return res.json();
}

async function fetchTransactions(token: string) {
  const res = await fetch("/api/transactions?limit=5", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export default function DashboardPage() {
  const { user, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const primaryWallet = wallets[0];

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const token = await getAccessToken();
      return fetchBalance(token!);
    },
    refetchInterval: 30000,
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["transactions-recent"],
    queryFn: async () => {
      const token = await getAccessToken();
      return fetchTransactions(token!);
    },
    refetchInterval: 30000,
  });

  const displayName =
    primaryWallet?.address
      ? formatAddress(primaryWallet.address)
      : user?.email?.address?.split("@")[0] ?? "Investor";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {displayName} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Here&apos;s your vault performance overview
        </p>
      </motion.div>

      <StatsCards data={balance} isLoading={balanceLoading} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <RecentTransactions
          transactions={txData?.transactions}
          isLoading={txLoading}
        />
        <ProfitChart
          depositAmount={balance?.totalDeposited ?? 0}
        />
      </div>
    </div>
  );
}
