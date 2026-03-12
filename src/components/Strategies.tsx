import { FadeIn } from "./FadeIn";

const bots = [
  { name: "BTC Scalper", pair: "BTC/USDT", strategy: "Scalp", winRate: "72%", pnl: "+$12,847", trades: "1,247" },
  { name: "ETH Swing", pair: "ETH/USDT", strategy: "Swing", winRate: "65%", pnl: "+$8,412", trades: "342" },
  { name: "SOL Trend", pair: "SOL/USDT", strategy: "Trend", winRate: "58%", pnl: "+$5,120", trades: "891" },
  { name: "ARB News", pair: "ARB/USDT", strategy: "News", winRate: "61%", pnl: "+$3,300", trades: "156" },
];

const Strategies = () => {
  return (
    <section id="performance" className="py-24 bg-secondary">
      <div className="container">
        <FadeIn>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 text-center">Performance</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-4">
            Live bot results
          </h2>
          <p className="text-muted-foreground text-center max-w-md mx-auto mb-14">
            Real configurations running on the platform right now.
          </p>
        </FadeIn>

        <div className="max-w-2xl mx-auto">
          <div className="bg-background rounded-2xl border border-border overflow-hidden divide-y divide-border">
            {bots.map((s, i) => (
              <FadeIn key={s.name} delay={i * 0.08}>
                <div className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">{s.name}</span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{s.pair}</span>
                    <span className="text-xs text-foreground bg-accent px-2 py-0.5 rounded-md">{s.strategy}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-muted-foreground uppercase">Win</div>
                      <div className="text-sm font-semibold text-foreground">{s.winRate}</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-muted-foreground uppercase">Trades</div>
                      <div className="text-sm font-semibold text-foreground">{s.trades}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground uppercase">P&L</div>
                      <div className="text-sm font-semibold text-positive">{s.pnl}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Strategies;
