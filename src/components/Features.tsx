import { TrendingUp, Crosshair, Newspaper, Shield, BarChart3, Bell } from "lucide-react";

const features = [
  {
    icon: Crosshair,
    title: "Scalping Mode",
    desc: "Execute rapid trades on short timeframes. The bot identifies micro-trends and takes quick profits with tight stop-losses.",
  },
  {
    icon: TrendingUp,
    title: "Swing & Long Hold",
    desc: "Ride larger market moves. The bot identifies trend reversals and holds positions for hours or days for maximum gains.",
  },
  {
    icon: Newspaper,
    title: "News-Based Trading",
    desc: "Reacts to market news and social signals. Detects sentiment shifts and enters positions before the crowd.",
  },
  {
    icon: Shield,
    title: "Smart SL / TP",
    desc: "Dynamic stop-loss and take-profit that adjusts based on volatility and market conditions. Trailing stops included.",
  },
  {
    icon: BarChart3,
    title: "Multi-Exchange",
    desc: "Trade perps on Binance, Bybit, dYdX, GMX, and more. Best execution routing across CEX and DEX platforms.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    desc: "Get notified on trade entries, exits, P&L thresholds, and strategy adjustments via Telegram or Discord.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/20">
      <div className="container">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">02 · Features</span>
          <h2 className="font-mono text-4xl font-bold mt-3">
            Built to <span className="text-primary">trade perps</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="border border-border rounded-lg p-6 bg-card hover:border-primary/40 transition-colors group">
              <feature.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-mono text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
