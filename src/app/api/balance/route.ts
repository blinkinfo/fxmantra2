import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateBalanceSummary } from "@/lib/profit";

export async function GET(req: NextRequest) {
  const auth = await verifyPrivyToken(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [deposits, withdrawals] = await Promise.all([
      prisma.deposit.findMany({
        where: { userId: auth.userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.withdrawal.findMany({
        where: { userId: auth.userId },
        orderBy: { requestedAt: "desc" },
      }),
    ]);

    const summary = calculateBalanceSummary(deposits, withdrawals);

    return NextResponse.json(summary);
  } catch (err) {
    console.error("Balance error:", err);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
}
