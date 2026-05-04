import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "YieldVault — Earn 10% Monthly on Your Crypto",
  description:
    "Deposit USDC on Base and earn guaranteed 10% monthly returns. Secure, transparent, and built on Web3.",
  keywords: ["crypto", "yield", "USDC", "Base", "DeFi", "stablecoin"],
  openGraph: {
    title: "YieldVault — Earn 10% Monthly on Your Crypto",
    description: "Deposit USDC on Base and earn guaranteed 10% monthly returns.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
