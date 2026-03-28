import { useState, useEffect } from "react";
import { TrendingUp, Flame, Zap, ArrowUpRight } from "lucide-react";

const COINS = [
  { symbol: "BTC", base: 68420 },
  { symbol: "ETH", base: 3850 },
  { symbol: "SOL", base: 178.5 },
  { symbol: "MIRAGE", base: 0.042 },
];

const randomDelta = (base: number, pct = 0.003) =>
  base * (1 + (Math.random() - 0.35) * pct);

const MarketPulse = () => {
  const [prices, setPrices] = useState(() =>
    COINS.map((c) => ({ ...c, price: c.base, change: +(Math.random() * 6 + 0.5).toFixed(2) }))
  );
  const [fearGreed, setFearGreed] = useState(78);

  useEffect(() => {
    const id = setInterval(() => {
      setPrices((prev) =>
        prev.map((c) => {
          const newPrice = randomDelta(c.price);
          const change = +((((newPrice - c.base) / c.base) * 100) + c.change * 0.6).toFixed(2);
          return { ...c, price: newPrice, change: Math.abs(change) > 0.01 ? change : Math.abs(change) + 0.1 };
        })
      );
      setFearGreed((prev) => Math.min(95, Math.max(60, prev + (Math.random() - 0.4) * 3)));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-3 mt-3 mb-1 rounded-xl border border-positive/20 bg-gradient-to-r from-positive/5 via-background to-primary/5 p-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-positive/15 text-positive">
          <TrendingUp className="h-3 w-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Bullish</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">Market Pulse</span>
        <div className="ml-auto flex items-center gap-1 text-[10px] font-mono">
          <Flame className="h-3 w-3 text-orange-400" />
          <span className="text-muted-foreground">Fear & Greed:</span>
          <span className="text-positive font-bold">{Math.round(fearGreed)}</span>
          <span className="text-positive text-[9px]">GREED</span>
        </div>
      </div>

      {/* Coins */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {prices.map((coin) => (
          <div
            key={coin.symbol}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/60 border border-border/50 hover:border-positive/30 transition-colors group cursor-default"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground group-hover:text-positive transition-colors">
                {coin.symbol}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                ${coin.price >= 1000
                  ? coin.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
                  : coin.price < 1
                  ? coin.price.toFixed(4)
                  : coin.price.toFixed(2)}
              </span>
            </div>
            <div className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${
              coin.change >= 0 ? "text-positive" : "text-negative"
            }`}>
              {coin.change >= 0 ? <ArrowUpRight className="h-2.5 w-2.5" /> : null}
              {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
            </div>
          </div>
        ))}

        {/* Volume pill */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <Zap className="h-3 w-3 text-primary" />
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase">24h Vol</span>
            <span className="text-[11px] font-mono font-bold text-foreground">$4.2B</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
