# YieldVault

A mobile-first Web3 yield platform where users deposit USDC on Base chain and earn 10% monthly returns.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Auth**: Privy v3 (`@privy-io/react-auth`) — supports email, social, and wallet login
- **Wallet/Web3**: wagmi v2 + viem + `@privy-io/wagmi` v4
- **Database**: PostgreSQL via Prisma (Neon recommended)
- **UI**: Tailwind CSS + Framer Motion + Recharts
- **Deployment**: Vercel

## Architecture

- **Custodial model**: Users send USDC (Base chain) to a platform wallet. Profits tracked in the database.
- **10% monthly yield**: Calculated as `depositAmount * 0.10 * (daysElapsed / 30)`
- **Withdrawal dates**: Only 1st, 11th, and 21st of each month
- **Withdrawable**: Only earned profit (principal is locked)

## Project Structure

```
src/
  app/
    page.tsx                  - Landing page
    dashboard/
      page.tsx                - Main dashboard
      deposit/page.tsx        - Deposit flow
      withdraw/page.tsx       - Withdrawal flow
      transactions/page.tsx   - Transaction history
    api/
      balance/route.ts        - Balance & profit summary
      deposit/route.ts        - Record deposits, verify on-chain
      withdraw/route.ts       - Request withdrawals (date-gated)
      transactions/route.ts   - Transaction history
      user/route.ts           - User profile
  components/
    layout/                   - Navbar, Sidebar, MobileNav
    dashboard/                - StatsCards, RecentTransactions, ProfitChart
    deposit/                  - DepositForm
    withdraw/                 - WithdrawForm
    ui/                       - Button, Card, Input, Badge
  lib/
    auth.ts                   - Privy server-side JWT verification
    chain.ts                  - viem public client, USDC helpers
    constants.ts              - Token addresses, rates, withdrawal days
    profit.ts                 - Balance & profit calculation logic
    prisma.ts                 - Prisma singleton client
    utils.ts                  - Date/formatting utilities
```

## Required Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID from console.privy.io |
| `PRIVY_APP_SECRET` | Privy app secret (server-side) |
| `DATABASE_URL` | PostgreSQL connection string (Neon recommended) |
| `NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS` | Custodial wallet that receives USDC deposits |

## Running Locally

```bash
npm install
npx prisma generate
npx prisma db push   # after DATABASE_URL is set
npm run dev          # runs on port 5000
```

## Deployment (Vercel)

1. Push to GitHub
2. Import into Vercel
3. Set all environment variables in Vercel dashboard
4. Run `npx prisma db push` against production DB
5. Deploy

## Key Business Logic

- USDC contract on Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Profit rate: 10% / 30 days = ~0.333% daily
- Deposits go on-chain to `NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS`
- Deposit verification happens asynchronously after tx submission
- Withdrawals are request-based (platform processes them manually or via cron)
