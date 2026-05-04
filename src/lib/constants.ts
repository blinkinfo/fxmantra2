export const MONTHLY_PROFIT_RATE = 0.10;
export const DAILY_PROFIT_RATE = MONTHLY_PROFIT_RATE / 30;

export const WITHDRAWAL_DAYS = [1, 11, 21];

export const USDC_ADDRESS_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const USDC_DECIMALS = 6;

export const MIN_DEPOSIT_AMOUNT = 10;

export const BASE_CHAIN_ID = 8453;

export const TOKENS = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: USDC_ADDRESS_BASE,
    decimals: 6,
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
} as const;

export const TOKEN_SYMBOLS = Object.keys(TOKENS) as Array<keyof typeof TOKENS>;

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  failed: "Failed",
  processing: "Processing",
  completed: "Completed",
  rejected: "Rejected",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  confirmed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  failed: "text-red-400 bg-red-400/10 border-red-400/20",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  rejected: "text-red-400 bg-red-400/10 border-red-400/20",
};

export const TX_TYPE_LABELS: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  profit: "Profit Credit",
};

export const TX_TYPE_COLORS: Record<string, string> = {
  deposit: "text-blue-400",
  withdrawal: "text-orange-400",
  profit: "text-emerald-400",
};
