"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount, useSendTransaction } from "wagmi";
import { parseUnits, encodeFunctionData } from "viem";
import {
  ArrowDownToLine,
  CheckCircle,
  ExternalLink,
  Info,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  USDC_ADDRESS_BASE,
  USDC_DECIMALS,
  MIN_DEPOSIT_AMOUNT,
} from "@/lib/constants";
import { formatUSD, getBaseExplorerUrl } from "@/lib/utils";

const PLATFORM_WALLET =
  process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS ??
  "0x0000000000000000000000000000000000000000";

const erc20TransferAbi = [
  {
    name: "transfer",
    type: "function" as const,
    stateMutability: "nonpayable" as const,
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

type Step = "input" | "confirming" | "success" | "error";

export default function DepositForm({ onSuccess }: { onSuccess?: () => void }) {
  const { authenticated, login, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const { sendTransactionAsync } = useSendTransaction();

  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const numAmount = parseFloat(amount);
  const isValidAmount = !isNaN(numAmount) && numAmount >= MIN_DEPOSIT_AMOUNT;
  const projectedMonthlyProfit = isValidAmount ? numAmount * 0.1 : 0;

  const handleDeposit = async () => {
    if (!authenticated || !isValidAmount) return;

    setIsLoading(true);
    setError("");

    try {
      const data = encodeFunctionData({
        abi: erc20TransferAbi,
        functionName: "transfer",
        args: [
          PLATFORM_WALLET as `0x${string}`,
          parseUnits(amount, USDC_DECIMALS),
        ],
      });

      setStep("confirming");

      const hash = await sendTransactionAsync({
        to: USDC_ADDRESS_BASE as `0x${string}`,
        data,
      });

      setTxHash(hash);

      const token = await getAccessToken();
      const wallet = wallets[0];

      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          txHash: hash,
          amount: numAmount,
          token: "USDC",
          walletAddress: wallet?.address,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to record deposit");
      }

      setStep("success");
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Transaction failed";
      if (
        message.toLowerCase().includes("rejected") ||
        message.toLowerCase().includes("denied") ||
        message.toLowerCase().includes("cancelled")
      ) {
        setError("Transaction was rejected.");
        setStep("input");
      } else {
        setError(message);
        setStep("error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep("input");
    setAmount("");
    setTxHash("");
    setError("");
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <ArrowDownToLine size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Deposit USDC</h3>
                  <p className="text-xs text-gray-500">
                    Earn 10% monthly on Base network
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Amount (USDC)"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={MIN_DEPOSIT_AMOUNT}
                  step="1"
                  hint={`Minimum deposit: ${formatUSD(MIN_DEPOSIT_AMOUNT)}`}
                  suffix={
                    <span className="text-xs font-semibold text-gray-400 bg-surface rounded-lg px-2 py-1">
                      USDC
                    </span>
                  }
                />

                <div className="flex gap-2">
                  {[100, 500, 1000, 5000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className="flex-1 py-1.5 text-xs font-medium text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg border border-white/8 transition-all"
                    >
                      ${preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                {isValidAmount && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15"
                  >
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                      <Info size={12} className="text-emerald-400" />
                      Projected returns
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Monthly profit</span>
                      <span className="text-emerald-400 font-semibold">
                        +{formatUSD(projectedMonthlyProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">Annual profit</span>
                      <span className="text-emerald-400 font-semibold">
                        +{formatUSD(projectedMonthlyProfit * 12)}
                      </span>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-white/[0.02]">
              <div className="flex items-start gap-2 mb-3">
                <Info size={14} className="text-gray-500 mt-0.5 shrink-0" />
                <p className="text-xs font-medium text-gray-400">
                  Important — Read before depositing
                </p>
              </div>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Deposits are made in USDC on the Base network
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Principal is locked — only profit is withdrawable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Withdrawals available on 1st, 11th &amp; 21st each month
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Ensure you&apos;re connected to Base network in your wallet
                </li>
              </ul>
            </Card>

            {!authenticated ? (
              <Button onClick={login} fullWidth size="lg">
                Connect Wallet to Deposit
              </Button>
            ) : (
              <Button
                onClick={handleDeposit}
                fullWidth
                size="lg"
                disabled={!isValidAmount || isLoading}
                isLoading={isLoading}
              >
                <ArrowDownToLine size={16} />
                Deposit {isValidAmount ? formatUSD(numAmount) : ""} USDC
              </Button>
            )}
          </motion.div>
        )}

        {step === "confirming" && (
          <motion.div
            key="confirming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Loader2 size={28} className="text-primary animate-spin" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">
                Confirming Transaction
              </h3>
              <p className="text-sm text-gray-400">
                Please confirm the transaction in your wallet and wait for
                on-chain confirmation...
              </p>
            </Card>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle size={28} className="text-emerald-400" />
              </motion.div>
              <h3 className="font-bold text-white text-xl mb-2">
                Deposit Successful!
              </h3>
              <p className="text-sm text-gray-400 mb-1">
                {formatUSD(numAmount)} USDC deposited successfully
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Your position will start earning 10% monthly returns
              </p>

              {txHash && (
                <a
                  href={getBaseExplorerUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-light transition-colors mb-6"
                >
                  View on Basescan
                  <ExternalLink size={11} />
                </a>
              )}

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 mb-6">
                <p className="text-xs text-gray-400">Monthly earnings</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  +{formatUSD(numAmount * 0.1)}
                </p>
              </div>

              <Button onClick={reset} variant="secondary" size="sm">
                Make Another Deposit
              </Button>
            </Card>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-400" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">
                Deposit Failed
              </h3>
              <p className="text-sm text-gray-400 mb-6">{error}</p>
              <Button onClick={reset} variant="secondary" size="sm">
                Try Again
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
