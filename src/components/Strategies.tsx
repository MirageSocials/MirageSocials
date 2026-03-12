const strategies = [
  { name: "BTC Scalper", pair: "BTC/USDT", strategy: "Scalp", winRate: "72%", pnl: "+$12,847", trades: "1,247" },
  { name: "ETH Swing", pair: "ETH/USDT", strategy: "Swing", winRate: "65%", pnl: "+$8,412", trades: "342" },
  { name: "SOL Trend", pair: "SOL/USDT", strategy: "Trend", winRate: "58%", pnl: "+$5,120", trades: "891" },
  { name: "ARB News", pair: "ARB/USDT", strategy: "News", winRate: "61%", pnl: "+$3,300", trades: "156" },
];

const Strategies = () => {
  return (
    <section id="strategies" className="py-24">
      <div className="container">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">03 · Strategies</span>
          <h2 className="font-mono text-4xl font-bold mt-3">
            Active <span className="text-primary">bots</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg">
            Example configurations running on the platform. Deploy similar strategies in minutes.
          </p>
        </div>
        <div className="space-y-3">
          {strategies.map((s) => (
            <div key={s.name} className="border border-border rounded-lg p-5 bg-card flex flex-wrap items-center justify-between gap-4 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-semibold text-foreground">{s.name}</span>
                <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{s.pair}</span>
                <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-1 rounded">{s.strategy}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-mono text-xs text-muted-foreground">Win Rate</div>
                  <div className="font-mono text-sm font-semibold text-foreground">{s.winRate}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-xs text-muted-foreground">Trades</div>
                  <div className="font-mono text-sm font-semibold text-foreground">{s.trades}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-xs text-muted-foreground">P&L</div>
                  <div className="font-mono text-sm font-semibold text-positive">{s.pnl}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Strategies;
