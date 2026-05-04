"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { base } from "viem/chains";
import { useState } from "react";

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        defaultChain: base,
        supportedChains: [base],
        appearance: {
          theme: "dark",
          accentColor: "#8b5cf6",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        loginMethods: ["email", "wallet", "google"],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
