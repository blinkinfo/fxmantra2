import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateBalanceSummary } from "@/lib/profit";
import { isWithdrawalDay } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const auth = await verifyPrivyToken(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isWithdrawalDay()) {
    const today = new Date().getDate();
    return NextResponse.json(
      {
        error: `Withdrawals are only allowed on the 1st, 11th, and 21st of each month. Today is the ${today}th.`,
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { amount, token = "USDC" } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid withdrawal amount" },
        { status: 400 }
      );
    }

    const [deposits, withdrawals] = await Promise.all([
      prisma.deposit.findMany({ where: { userId: auth.userId } }),
      prisma.withdrawal.findMany({ where: { userId: auth.userId } }),
    ]);

    const summary = calculateBalanceSummary(deposits, withdrawals);

    if (amount > summary.availableProfit) {
      return NextResponse.json(
        {
          error: `Insufficient profit. Available: $${summary.availableProfit.toFixed(2)}`,
        },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: auth.userId,
        amount,
        token,
        status: "pending",
      },
    });

    await prisma.transaction.create({
      data: {
        userId: auth.userId,
        type: "withdrawal",
        amount,
        token,
        status: "pending",
        note: "Withdrawal request submitted",
      },
    });

    return NextResponse.json({ withdrawal }, { status: 201 });
  } catch (err) {
    console.error("Withdrawal error:", err);
    return NextResponse.json(
      { error: "Failed to create withdrawal request" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = await verifyPrivyToken(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: auth.userId },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json({ withdrawals });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
