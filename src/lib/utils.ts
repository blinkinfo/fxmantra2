import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { WITHDRAWAL_DAYS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return `$${formatCurrency(amount, 2)}`;
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy 'at' HH:mm");
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isWithdrawalDay(date: Date = new Date()): boolean {
  return WITHDRAWAL_DAYS.includes(date.getDate());
}

export function getNextWithdrawalDate(from: Date = new Date()): Date {
  const currentDay = from.getDate();
  const currentMonth = from.getMonth();
  const currentYear = from.getFullYear();

  const futureDays = WITHDRAWAL_DAYS.filter((d) => d > currentDay);

  if (futureDays.length > 0) {
    return new Date(currentYear, currentMonth, futureDays[0]);
  }

  return new Date(currentYear, currentMonth + 1, WITHDRAWAL_DAYS[0]);
}

export function getDaysUntilNextWithdrawal(from: Date = new Date()): number {
  const next = getNextWithdrawalDate(from);
  const diff = next.getTime() - from.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculateProfit(
  depositAmount: number,
  confirmedAt: Date | string
): number {
  const confirmed = new Date(confirmedAt);
  const now = new Date();
  const daysElapsed = Math.max(
    0,
    (now.getTime() - confirmed.getTime()) / (1000 * 60 * 60 * 24)
  );
  const monthsElapsed = daysElapsed / 30;
  return depositAmount * 0.1 * monthsElapsed;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shortenTxHash(hash: string): string {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function getBaseExplorerUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}
