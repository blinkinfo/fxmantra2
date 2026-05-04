"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpFromLine } from "lucide-react";
import WithdrawForm from "@/components/withdraw/withdraw-form";

async function fetchBalance(token: string) {
  const res = await fetch("/api/balance", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch balance");
  return res.json();
}

export default function WithdrawPage() {
  const { getAccessToken } = usePrivy();
  const queryClient = useQueryClient();

  const { data: balance, isLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const token = await getAccessToken();
      return fetchBalance(token!);
    },
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["balance"] });
    queryClient.invalidateQueries({ queryKey: ["transactions-recent"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10">
            <ArrowUpFromLine size={20} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Withdraw</h1>
            <p className="text-sm text-gray-400">
              Withdraw your earned profit on allowed dates
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="max-w-lg">
          <div className="glass rounded-2xl p-12 flex items-center justify-center border border-white/5">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        </div>
      ) : (
        <div className="max-w-lg">
          <WithdrawForm
            availableProfit={balance?.availableProfit ?? 0}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </div>
  );
}
