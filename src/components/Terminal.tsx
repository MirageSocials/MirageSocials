import { useEffect, useState } from "react";

const lines = [
  { text: "$ perpbot init", type: "command" as const },
  { text: "◆ PerpBot Agent v1.0.0", type: "info" as const },
  { text: "Connecting to exchanges...", type: "info" as const },
  { text: "✓ Connected (Binance • Bybit • dYdX • GMX)", type: "success" as const },
  { text: "Loading strategy engines...", type: "info" as const },
  { text: "✓ Scalping • Swing • Trend • News-Based", type: "success" as const },
  { text: "$ perpbot deploy --pair BTC/USDT --strategy scalp", type: "command" as const },
  { text: "Analyzing market conditions...", type: "info" as const },
  { text: "✓ Volatility: HIGH · Trend: BULLISH · Confidence: 87%", type: "success" as const },
  { text: "Setting SL: $67,240 | TP: $69,800", type: "info" as const },
  { text: "✓ Agent deployed. Auto-trading BTC/USDT perps...", type: "success" as const },
];

const Terminal = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, visibleLines === 0 ? 500 : 400 + Math.random() * 300);
      return () => clearTimeout(timeout);
    }
  }, [visibleLines]);

  return (
    <div className="rounded-lg border border-terminal-border bg-terminal-bg overflow-hidden glow-primary">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-terminal-header border-b border-terminal-border">
        <div className="w-3 h-3 rounded-full bg-destructive" />
        <div className="w-3 h-3 rounded-full" style={{ background: "hsl(45, 90%, 55%)" }} />
        <div className="w-3 h-3 rounded-full bg-primary" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">trader@perpbot</span>
      </div>
      {/* Body */}
      <div className="p-5 font-mono text-sm space-y-1 min-h-[320px]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={
            line.type === "command" ? "text-foreground font-semibold" :
            line.type === "success" ? "text-primary" :
            "text-muted-foreground"
          }>
            {line.text}
          </div>
        ))}
        {visibleLines < lines.length && (
          <span className="text-foreground">$ <span className="terminal-cursor">▊</span></span>
        )}
        {visibleLines >= lines.length && (
          <span className="text-foreground">$ <span className="terminal-cursor">▊</span></span>
        )}
      </div>
    </div>
  );
};

export default Terminal;
