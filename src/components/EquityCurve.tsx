import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EquityCurveProps {
  balanceHistory: { time: number; balance: number }[];
}

const EquityCurve = ({ balanceHistory }: EquityCurveProps) => {
  const data = useMemo(
    () =>
      balanceHistory.map((p) => ({
        time: new Date(p.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        balance: Math.round(p.balance * 100) / 100,
      })),
    [balanceHistory]
  );

  if (data.length < 2) {
    return (
      <div className="rounded-xl border border-border p-8 text-center text-xs text-muted-foreground font-mono">
        Equity curve will appear as trades execute…
      </div>
    );
  }

  const startBalance = data[0].balance;
  const currentBalance = data[data.length - 1].balance;
  const isPositive = currentBalance >= startBalance;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Equity Curve</span>
        <span className={`text-xs font-mono font-bold ${isPositive ? "text-positive" : "text-negative"}`}>
          {isPositive ? "+" : ""}${(currentBalance - startBalance).toFixed(2)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? "hsl(152, 55%, 40%)" : "hsl(0, 65%, 52%)"} stopOpacity={0.2} />
              <stop offset="100%" stopColor={isPositive ? "hsl(152, 55%, 40%)" : "hsl(0, 65%, 52%)"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(215, 14%, 46%)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
          <Tooltip
            contentStyle={{ fontSize: 11, fontFamily: "JetBrains Mono", background: "hsl(210, 20%, 98%)", border: "1px solid hsl(214, 20%, 88%)", borderRadius: 8 }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Balance"]}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke={isPositive ? "hsl(152, 55%, 40%)" : "hsl(0, 65%, 52%)"}
            strokeWidth={1.5}
            fill="url(#equityGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquityCurve;
