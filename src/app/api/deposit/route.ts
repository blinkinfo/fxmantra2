import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MIN_DEPOSIT_AMOUNT } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const auth = await verifyPrivyToken(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { txHash, amount, token = "USDC", walletAddress } = body;

    if (!txHash || !amount) {
      return NextResponse.json(
        { error: "txHash and amount are required" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount < MIN_DEPOSIT_AMOUNT) {
      return NextResponse.json(
        { error: `Minimum deposit is $${MIN_DEPOSIT_AMOUNT}` },
        { status: 400 }
      );
    }

    const existing = await prisma.deposit.findUnique({ where: { txHash } });
    if (existing) {
      return NextResponse.json(
        { error: "Transaction already recorded" },
        { status: 409 }
      );
    }

    if (walletAddress) {
      await prisma.user.update({
        where: { id: auth.userId },
        data: { walletAddress },
      });
    }

    const deposit = await prisma.deposit.create({
      data: {
        userId: auth.userId,
        txHash,
        amount,
        token,
        status: "pending",
      },
    });

    await prisma.transaction.create({
      data: {
        userId: auth.userId,
        type: "deposit",
        amount,
        token,
        txHash,
        status: "pending",
      },
    });

    // In production: trigger background job to verify on-chain
    // For now, auto-confirm after a short delay (replace with webhook/cron)
    confirmDepositAsync(deposit.id, txHash);

    return NextResponse.json({ deposit }, { status: 201 });
  } catch (err) {
    console.error("Deposit error:", err);
    return NextResponse.json(
      { error: "Failed to record deposit" },
      { status: 500 }
    );
  }
}

// Background confirmation — in production use a proper job queue or webhook
async function confirmDepositAsync(depositId: string, txHash: string) {
  try {
    // Wait for likely on-chain confirmation
    await new Promise((resolve) => setTimeout(resolve, 15000));

    const { verifyUSDCTransfer } = await import("@/lib/chain");
    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: true },
    });

    if (!deposit || deposit.status !== "pending") return;

    const platformWallet = process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS;
    const userWallet = deposit.user.walletAddress;

    if (!platformWallet || !userWallet) {
      // If we can't verify, confirm optimistically
      await prisma.$transaction([
        prisma.deposit.update({
          where: { id: depositId },
          data: { status: "confirmed", confirmedAt: new Date() },
        }),
        prisma.transaction.updateMany({
          where: { txHash },
          data: { status: "confirmed" },
        }),
      ]);
      return;
    }

    const result = await verifyUSDCTransfer(
      txHash,
      platformWallet,
      deposit.amount,
      userWallet
    );

    if (result.valid) {
      await prisma.$transaction([
        prisma.deposit.update({
          where: { id: depositId },
          data: { status: "confirmed", confirmedAt: new Date() },
        }),
        prisma.transaction.updateMany({
          where: { txHash },
          data: { status: "confirmed" },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.deposit.update({
          where: { id: depositId },
          data: { status: "failed" },
        }),
        prisma.transaction.updateMany({
          where: { txHash },
          data: { status: "failed" },
        }),
      ]);
    }
  } catch (err) {
    console.error("Deposit confirmation error:", err);
  }
}

export async function GET(req: NextRequest) {
  const auth = await verifyPrivyToken(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deposits = await prisma.deposit.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ deposits });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch deposits" },
      { status: 500 }
    );
  }
}
