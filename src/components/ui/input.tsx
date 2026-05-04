"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, suffix, prefix, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
              "transition-all duration-200",
              prefix && "pl-10",
              suffix && "pr-24",
              error && "border-red-500/50 focus:ring-red-500/30",
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
