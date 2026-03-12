import { useEffect, useState } from "react";

const lines = [
  { text: "$ perpbot deploy --pair BTC/USDT --strategy scalp", type: "command" as const },
  { text: "Analyzing market...", type: "info" as const },
  { text: "✓ Volatility: HIGH · Trend: BULLISH · 87% confidence", type: "success" as const },
  { text: "✓ SL: $67,240  TP: $69,800", type: "success" as const },
  { text: "✓ Bot deployed. Trading BTC/USDT perps...", type: "success" as const },
];

const Terminal = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const timeout = setTimeout(() => setVisibleLines((p) => p + 1), 500 + Math.random() * 300);
      return () => clearTimeout(timeout);
    }
  }, [visibleLines]);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-accent/50 border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">terminal</span>
      </div>
      <div className="p-4 font-mono text-xs space-y-1 min-h-[180px]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={
            line.type === "command" ? "text-foreground font-medium" :
            line.type === "success" ? "text-primary" :
            "text-muted-foreground"
          }>{line.text}</div>
        ))}
        <span className="text-foreground">$ <span className="terminal-cursor">▊</span></span>
      </div>
    </div>
  );
};

export default Terminal;
