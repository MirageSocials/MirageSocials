import { FadeIn } from "./FadeIn";

const agents = [
  { name: "BTC Scalper", pair: "BTC/USDT", style: "Scalper", winRate: "72%", pnl: "+$12,847", status: "LIVE" },
  { name: "ETH Swing", pair: "ETH/USDT", style: "Swing", winRate: "65%", pnl: "+$8,412", status: "LIVE" },
  { name: "SOL Trend", pair: "SOL/USDT", style: "Trend", winRate: "58%", pnl: "+$5,120", status: "LIVE" },
  { name: "ARB Degen", pair: "ARB/USDT", style: "Degen", winRate: "61%", pnl: "+$3,300", status: "PAUSED" },
];

const Strategies = () => {
  return (
    <section id="performance" className="py-24 border-t border-border">
      <div className="container">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-widest uppercase text-primary mb-3">Live agents</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">
              Active <em className="not-italic text-primary">agents</em>
            </h2>
          </div>
        </FadeIn>

        <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-5 gap-2 px-5 py-2.5 border-b border-border text-[9px] tracking-widest uppercase text-muted-foreground">
            <span className="col-span-2">Agent</span>
            <span className="text-center">Win</span>
            <span className="text-right">P&L</span>
            <span className="text-right">Status</span>
          </div>

          {agents.map((a, i) => (
            <FadeIn key={a.name} delay={i * 0.06}>
              <div className="grid grid-cols-5 gap-2 px-5 py-3 border-b border-border/50 hover:bg-accent/30 transition-colors items-center">
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{a.name}</span>
                  <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{a.pair}</span>
                </div>
                <span className="text-xs text-foreground text-center">{a.winRate}</span>
                <span className="text-xs font-semibold text-primary text-right">{a.pnl}</span>
                <div className="flex items-center justify-end gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${a.status === "LIVE" ? "bg-primary" : "bg-muted-foreground"}`} />
                  <span className={`text-[9px] tracking-wider ${a.status === "LIVE" ? "text-primary" : "text-muted-foreground"}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Strategies;
