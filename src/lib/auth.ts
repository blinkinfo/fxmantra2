import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest } from "next/server";
import prisma from "./prisma";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function verifyPrivyToken(
  req: NextRequest
): Promise<{ userId: string; privyId: string } | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);

  try {
    const claims = await privyClient.verifyAuthToken(token);
    const privyId = claims.userId;

    let user = await prisma.user.findUnique({ where: { privyId } });

    if (!user) {
      user = await prisma.user.create({ data: { privyId } });
    }

    return { userId: user.id, privyId };
  } catch {
    return null;
  }
}
