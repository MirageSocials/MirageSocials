import { TrendingUp, Crosshair, Newspaper, Shield, BarChart3, Bell } from "lucide-react";

const features = [
  { icon: Crosshair, title: "Scalping Mode", desc: "Rapid trades on short timeframes with tight stop-losses for quick profits." },
  { icon: TrendingUp, title: "Swing & Long Hold", desc: "Ride larger moves by identifying trend reversals and holding for days." },
  { icon: Newspaper, title: "News-Based", desc: "Reacts to market news and sentiment shifts to enter positions early." },
  { icon: Shield, title: "Smart SL / TP", desc: "Dynamic risk management that adjusts to volatility with trailing stops." },
  { icon: BarChart3, title: "Multi-Exchange", desc: "Trade on Binance, Bybit, dYdX, GMX with best execution routing." },
  { icon: Bell, title: "Real-Time Alerts", desc: "Get notified on trades, P&L thresholds, and adjustments via Telegram." },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-accent/30">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Built for perp traders</h2>
          <p className="text-muted-foreground mt-2">Everything you need to automate perpetual futures.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border p-6 bg-background hover:shadow-md transition-shadow">
              <f.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="text-base font-semibold mb-1 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
