import { createPublicClient, http, parseUnits, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { USDC_ADDRESS_BASE, USDC_DECIMALS } from "./constants";

export const publicClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export const erc20Abi = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

export function encodeUSDCTransfer(to: string, amount: string): `0x${string}` {
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [to as `0x${string}`, parseUnits(amount, USDC_DECIMALS)],
  });
}

export async function verifyUSDCTransfer(
  txHash: string,
  expectedTo: string,
  expectedAmount: number,
  fromAddress: string
): Promise<{ valid: boolean; error?: string; blockNumber?: bigint }> {
  try {
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (!receipt) {
      return { valid: false, error: "Transaction not found" };
    }

    if (receipt.status !== "success") {
      return { valid: false, error: "Transaction failed" };
    }

    const tx = await publicClient.getTransaction({
      hash: txHash as `0x${string}`,
    });

    if (tx.to?.toLowerCase() !== USDC_ADDRESS_BASE.toLowerCase()) {
      return { valid: false, error: "Not a USDC transaction" };
    }

    if (tx.from.toLowerCase() !== fromAddress.toLowerCase()) {
      return { valid: false, error: "Transaction not from your wallet" };
    }

    return { valid: true, blockNumber: receipt.blockNumber };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Verification failed",
    };
  }
}

export async function getUSDCBalance(address: string): Promise<number> {
  try {
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS_BASE as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
    });
    return Number(balance) / Math.pow(10, USDC_DECIMALS);
  } catch {
    return 0;
  }
}
