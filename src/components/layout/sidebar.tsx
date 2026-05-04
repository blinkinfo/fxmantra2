"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/deposit",
    label: "Deposit",
    icon: ArrowDownToLine,
    exact: false,
  },
  {
    href: "/dashboard/withdraw",
    label: "Withdraw",
    icon: ArrowUpFromLine,
    exact: false,
  },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: History,
    exact: false,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen pt-24 pb-6 px-4 glass border-r border-white/5 fixed left-0 top-0 bottom-0">
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={18} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="glass-light rounded-2xl p-4 border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-primary" />
          <span className="text-xs font-semibold text-primary">
            Monthly APY
          </span>
        </div>
        <p className="text-3xl font-black gradient-text">10%</p>
        <p className="text-xs text-gray-500 mt-1">
          Fixed monthly return on your USDC deposits
        </p>
      </div>
    </aside>
  );
}
