"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import {
  ArrowUpFromLine,
  Calendar,
  CheckCircle,
  Lock,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  formatUSD,
  isWithdrawalDay,
  getNextWithdrawalDate,
  formatDate,
  getDaysUntilNextWithdrawal,
} from "@/lib/utils";

interface WithdrawFormProps {
  availableProfit: number;
  onSuccess?: () => void;
}

type Step = "input" | "processing" | "success" | "error";

export default function WithdrawForm({
  availableProfit,
  onSuccess,
}: WithdrawFormProps) {
  const { getAccessToken } = usePrivy();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canWithdraw = isWithdrawalDay();
  const nextDate = getNextWithdrawalDate();
  const daysUntil = getDaysUntilNextWithdrawal();

  const numAmount = parseFloat(amount);
  const isValidAmount =
    !isNaN(numAmount) && numAmount > 0 && numAmount <= availableProfit;

  const handleWithdraw = async () => {
    if (!isValidAmount || !canWithdraw) return;

    setIsLoading(true);
    setError("");

    try {
      setStep("processing");
      const token = await getAccessToken();

      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: numAmount, token: "USDC" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Withdrawal request failed");
      }

      setStep("success");
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(message);
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep("input");
    setAmount("");
    setError("");
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <AnimatePresence mode="wait">
        {!canWithdraw ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center py-12">
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-5"
              >
                <Lock size={28} className="text-yellow-400" />
              </motion.div>
              <h3 className="font-bold text-white text-xl mb-2">
                Withdrawals Locked
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Withdrawals are only available on the{" "}
                <span className="text-white font-semibold">
                  1st, 11th, and 21st
                </span>{" "}
                of each month
              </p>

              <div className="glass-light rounded-2xl p-5 text-left mb-6 border border-yellow-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-yellow-500/10">
                    <Calendar size={18} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Next Window
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(nextDate)}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-black text-white">
                      {daysUntil}
                    </p>
                    <p className="text-xs text-gray-500">days left</p>
                  </div>
                </div>
              </div>

              <div className="glass-light rounded-2xl p-4 text-left border border-white/5">
                <p className="text-xs text-gray-500 mb-3">
                  Available when window opens
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Available Profit
                  </span>
                  <span className="text-lg font-bold text-emerald-400">
                    {formatUSD(availableProfit)}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <>
            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                  <p className="text-xs text-emerald-400 font-medium">
                    Withdrawal window is open today!
                  </p>
                </div>

                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-orange-500/10">
                      <ArrowUpFromLine size={18} className="text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Withdraw Profit
                      </h3>
                      <p className="text-xs text-gray-500">
                        Only earned profit is withdrawable
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Available Profit
                      </span>
                      <span className="text-xl font-bold text-emerald-400">
                        {formatUSD(availableProfit)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Withdrawal Amount (USDC)"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      max={availableProfit}
                      min={1}
                      step="0.01"
                      error={
                        numAmount > availableProfit
                          ? "Amount exceeds available profit"
                          : undefined
                      }
                      suffix={
                        <button
                          onClick={() =>
                            setAmount(availableProfit.toFixed(2))
                          }
                          className="text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                        >
                          MAX
                        </button>
                      }
                    />

                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle
                          size={14}
                          className="text-red-400 shrink-0"
                        />
                        <p className="text-xs text-red-400">{error}</p>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-white/3 border border-white/8">
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Lock size={11} />
                        Your principal deposit remains locked and continues
                        earning
                      </p>
                    </div>
                  </div>
                </Card>

                <Button
                  onClick={handleWithdraw}
                  fullWidth
                  size="lg"
                  disabled={!isValidAmount || availableProfit === 0}
                  isLoading={isLoading}
                >
                  <ArrowUpFromLine size={16} />
                  Withdraw {isValidAmount ? formatUSD(numAmount) : ""}
                </Button>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Loader2 size={28} className="text-primary animate-spin" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">
                    Processing Request
                  </h3>
                  <p className="text-sm text-gray-400">
                    Your withdrawal request is being submitted...
                  </p>
                </Card>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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
                    Request Submitted!
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Your withdrawal of{" "}
                    <span className="text-white font-semibold">
                      {formatUSD(numAmount)} USDC
                    </span>{" "}
                    is being processed
                  </p>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-yellow-400 mb-6">
                    <Clock size={12} />
                    Processing may take up to 24 hours
                  </div>
                  <Button onClick={reset} variant="secondary" size="sm">
                    Done
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
                    Request Failed
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">{error}</p>
                  <Button onClick={reset} variant="secondary" size="sm">
                    Try Again
                  </Button>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
