"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowDownToLine, Info } from "lucide-react";
import DepositForm from "@/components/deposit/deposit-form";

export default function DepositPage() {
  const queryClient = useQueryClient();

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
          <div className="p-2.5 rounded-xl bg-blue-500/10">
            <ArrowDownToLine size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Deposit</h1>
            <p className="text-sm text-gray-400">
              Add USDC to your vault and start earning 10% monthly
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-lg">
        <div className="flex items-center gap-3 p-4 rounded-2xl glass border border-blue-500/15 mb-6">
          <Info size={16} className="text-blue-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">
              Make sure you&apos;re on the Base network
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              USDC deposits only work on Base (Chain ID: 8453). Switch your
              wallet network before depositing.
            </p>
          </div>
        </div>

        <DepositForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
