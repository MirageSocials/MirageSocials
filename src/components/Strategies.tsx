const strategies = [
  { name: "BTC Scalper", pair: "BTC/USDT", strategy: "Scalp", winRate: "72%", pnl: "+$12,847", trades: "1,247" },
  { name: "ETH Swing", pair: "ETH/USDT", strategy: "Swing", winRate: "65%", pnl: "+$8,412", trades: "342" },
  { name: "SOL Trend", pair: "SOL/USDT", strategy: "Trend", winRate: "58%", pnl: "+$5,120", trades: "891" },
  { name: "ARB News", pair: "ARB/USDT", strategy: "News", winRate: "61%", pnl: "+$3,300", trades: "156" },
];

const Strategies = () => {
  return (
    <section id="strategies" className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Active bots</h2>
          <p className="text-muted-foreground mt-2">Example configurations running live on the platform.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {strategies.map((s) => (
            <div key={s.name} className="rounded-xl border border-border p-4 bg-card flex items-center justify-between gap-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">{s.name}</span>
                <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-md">{s.pair}</span>
                <span className="text-xs text-primary bg-primary/8 px-2 py-0.5 rounded-md">{s.strategy}</span>
              </div>
              <div className="flex items-center gap-5 text-center">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase">Win</div>
                  <div className="text-sm font-semibold text-foreground">{s.winRate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase">Trades</div>
                  <div className="text-sm font-semibold text-foreground">{s.trades}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase">P&L</div>
                  <div className="text-sm font-semibold text-positive">{s.pnl}</div>
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
