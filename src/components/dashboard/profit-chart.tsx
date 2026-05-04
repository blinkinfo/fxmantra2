"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths, addDays } from "date-fns";

interface ProfitChartProps {
  depositAmount: number;
  depositDate?: Date;
}

function generateChartData(depositAmount: number, depositDate: Date) {
  const data = [];
  const monthsToShow = 6;

  for (let month = 0; month <= monthsToShow; month++) {
    const date = addDays(depositDate, month * 30);
    const profit = depositAmount * 0.1 * month;
    const total = depositAmount + profit;
    data.push({
      date: format(date, "MMM yy"),
      profit: parseFloat(profit.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    });
  }

  return data;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-white/10 shadow-card text-xs">
        <p className="text-gray-400 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400 capitalize">{entry.name}:</span>
            <span className="text-white font-semibold">
              ${entry.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProfitChart({
  depositAmount,
  depositDate = subMonths(new Date(), 1),
}: ProfitChartProps) {
  const data = generateChartData(
    depositAmount || 1000,
    depositDate
  );

  return (
    <div className="glass rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-white">Growth Projection</h3>
          <p className="text-xs text-gray-500 mt-0.5">6-month earnings forecast at 10%/month</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Projected 6-mo profit</p>
          <p className="text-lg font-bold text-emerald-400">
            +${(depositAmount * 0.6).toFixed(2)}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#profitGradient)"
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={1.5}
            fill="url(#totalGradient)"
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-violet-500 rounded" />
          <span className="text-xs text-gray-500">Profit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-blue-500 rounded" style={{ borderTop: "1px dashed" }} />
          <span className="text-xs text-gray-500">Total Value</span>
        </div>
      </div>
    </div>
  );
}
