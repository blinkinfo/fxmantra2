"use client";

import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Zap,
  Lock,
  Globe,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";

const features = [
  {
    icon: TrendingUp,
    title: "10% Monthly Returns",
    desc: "Fixed 10% monthly yield on your USDC deposits — higher than any traditional savings account.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Custodial",
    desc: "Your assets are managed by our team with enterprise-grade security and full transparency.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Powered by Base",
    desc: "Built on Coinbase's Base network — ultra-low fees, fast transactions, and rock-solid reliability.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Lock,
    title: "Controlled Withdrawals",
    desc: "Withdraw your earned profit on the 1st, 11th, or 21st of each month. Disciplined yield extraction.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Globe,
    title: "Web3 Native",
    desc: "Connect any wallet or sign up with email. Privy auth makes onboarding seamless for everyone.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Star,
    title: "Real-time Dashboard",
    desc: "Track your deposits, profits, and transaction history in a clean, intuitive interface.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
];

const steps = [
  { num: "01", title: "Connect Your Wallet", desc: "Sign in with your crypto wallet or email via Privy. No KYC, no friction." },
  { num: "02", title: "Deposit USDC", desc: "Send USDC on Base to your vault. Minimum $10 to start earning." },
  { num: "03", title: "Earn 10% Monthly", desc: "Watch your balance grow at 10% per month, tracked in real-time." },
  { num: "04", title: "Withdraw Profits", desc: "On the 1st, 11th, or 21st, withdraw your accumulated earnings." },
];

export default function LandingPage() {
  const { authenticated, login } = usePrivy();
  const router = useRouter();

  const handleCTA = () => {
    if (authenticated) router.push("/dashboard");
    else login();
  };

  return (
    <div className="min-h-screen hero-bg">
      <Navbar />

      <main>
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-glow-gradient pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 text-xs font-medium text-primary mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              Live on Base Network
              <ChevronRight size={12} />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
              Earn <span className="gradient-text">10%</span>
              <br />Every Month
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Deposit USDC on Base and watch your crypto grow at a guaranteed{" "}
              <span className="text-white font-semibold">10% monthly yield</span>.
              No lock-ups, no hidden fees, just pure compounding returns.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button onClick={handleCTA} size="lg" className="shadow-glow-lg">
                {authenticated ? "Go to Dashboard" : "Start Earning Now"}
                <ArrowRight size={18} />
              </Button>
              <Link href="#how-it-works">
                <Button variant="ghost" size="lg">How it works</Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { label: "Monthly APY", value: "10%" },
                { label: "Network", value: "Base" },
                { label: "Min Deposit", value: "$10" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4 border border-white/5">
                  <p className="text-2xl font-black gradient-text">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:block absolute right-16 top-40 glass rounded-2xl p-4 border border-primary/15 shadow-glow w-52"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Monthly Profit</p>
                <p className="text-sm font-bold text-white">+$1,000.00</p>
              </div>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">From $10,000 deposit</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden lg:block absolute left-16 bottom-20 glass rounded-2xl p-4 border border-white/8 shadow-card w-44"
          >
            <p className="text-xs text-gray-500 mb-1">Next withdrawal</p>
            <p className="text-sm font-bold text-white">1st of month</p>
            <p className="text-xs text-primary mt-1">1st · 11th · 21st</p>
          </motion.div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Everything you need to <span className="gradient-text">grow your crypto</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                A powerful, transparent yield platform designed for serious investors.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="glass rounded-2xl p-6 border border-white/5 card-hover"
                  >
                    <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                      <Icon size={20} className={feature.color} />
                    </div>
                    <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                How it <span className="gradient-text">works</span>
              </h2>
              <p className="text-gray-400">Start earning in 4 simple steps.</p>
            </div>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 border border-white/5 flex items-start gap-5"
                >
                  <span className="text-3xl font-black gradient-text shrink-0">{step.num}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-10 text-center border border-primary/20 glow-border shadow-glow"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={28} className="text-primary" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Ready to start earning?</h2>
              <p className="text-gray-400 mb-8">
                Join thousands of investors earning{" "}
                <span className="text-white font-semibold">10% every month</span> on their USDC.
              </p>
              <Button onClick={handleCTA} size="lg" className="shadow-glow">
                {authenticated ? "Go to Dashboard" : "Connect Wallet & Start"}
                <ArrowRight size={18} />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t border-white/5 text-center">
        <p className="text-xs text-gray-600">© 2025 YieldVault · Built on Base · All rights reserved</p>
      </footer>
    </div>
  );
}
