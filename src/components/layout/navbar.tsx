"use client";

import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import { Bell, ChevronDown, LogOut, User, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";
import { useWallets } from "@privy-io/react-auth";

export default function Navbar() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [menuOpen, setMenuOpen] = useState(false);

  const primaryWallet = wallets[0];
  const displayAddress = primaryWallet?.address
    ? formatAddress(primaryWallet.address)
    : user?.email?.address
    ? user.email.address
    : "Account";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-sm">Y</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Yield<span className="gradient-text">Vault</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {authenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/deposit"
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Deposit
                </Link>
                <Link
                  href="/dashboard/withdraw"
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Withdraw
                </Link>
                <Link
                  href="/dashboard/transactions"
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Transactions
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {!ready ? (
              <div className="w-24 h-9 bg-white/5 rounded-xl animate-pulse" />
            ) : authenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                    <User size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-300 hidden sm:block">
                    {displayAddress}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-52 glass rounded-2xl border border-white/10 overflow-hidden shadow-card"
                  >
                    <div className="p-2">
                      {primaryWallet?.address && (
                        <div className="px-3 py-2 mb-1">
                          <p className="text-xs text-gray-500">Wallet</p>
                          <p className="text-sm text-gray-300 font-mono mt-0.5">
                            {formatAddress(primaryWallet.address)}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <LogOut size={14} />
                        Disconnect
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button onClick={login} size="sm">
                <Wallet size={14} />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
