import { Deposit, Withdrawal } from "@prisma/client";

export interface BalanceSummary {
  totalDeposited: number;
  totalEarned: number;
  totalWithdrawn: number;
  availableProfit: number;
  pendingDeposits: number;
}

export function calculateTotalProfit(deposits: Deposit[]): number {
  const confirmedDeposits = deposits.filter(
    (d) => d.status === "confirmed" && d.confirmedAt
  );

  return confirmedDeposits.reduce((total, deposit) => {
    const confirmedAt = new Date(deposit.confirmedAt!);
    const now = new Date();
    const daysElapsed = Math.max(
      0,
      (now.getTime() - confirmedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const monthsElapsed = daysElapsed / 30;
    const earned = deposit.amount * 0.1 * monthsElapsed;
    return total + earned;
  }, 0);
}

export function calculateBalanceSummary(
  deposits: Deposit[],
  withdrawals: Withdrawal[]
): BalanceSummary {
  const confirmedDeposits = deposits.filter((d) => d.status === "confirmed");
  const pendingDeposits = deposits.filter((d) => d.status === "pending");

  const totalDeposited = confirmedDeposits.reduce((sum, d) => sum + d.amount, 0);
  const pendingDepositAmount = pendingDeposits.reduce((sum, d) => sum + d.amount, 0);

  const totalEarned = calculateTotalProfit(deposits);

  const completedWithdrawals = withdrawals.filter(
    (w) => w.status === "completed"
  );
  const totalWithdrawn = completedWithdrawals.reduce(
    (sum, w) => sum + w.amount,
    0
  );

  const availableProfit = Math.max(0, totalEarned - totalWithdrawn);

  return {
    totalDeposited,
    totalEarned,
    totalWithdrawn,
    availableProfit,
    pendingDeposits: pendingDepositAmount,
  };
}
