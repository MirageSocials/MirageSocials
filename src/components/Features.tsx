import { FadeIn } from "./FadeIn";
import { Crosshair, TrendingUp, Newspaper, Shield, BarChart3, Bell } from "lucide-react";

const features = [
  { icon: Crosshair, title: "Scalping", desc: "High-frequency entries on 1m-5m charts with tight risk management." },
  { icon: TrendingUp, title: "Swing Trading", desc: "Capture multi-day moves by riding trend reversals and breakouts." },
  { icon: Newspaper, title: "News Reactive", desc: "Auto-enters positions on market-moving news and sentiment shifts." },
  { icon: Shield, title: "Smart Risk", desc: "Dynamic SL/TP with trailing stops that adapt to real-time volatility." },
  { icon: BarChart3, title: "Multi-Exchange", desc: "Execute across Binance, Bybit, dYdX, GMX with best-price routing." },
  { icon: Bell, title: "Instant Alerts", desc: "Telegram and webhook notifications for every trade and threshold." },
];

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="container">
        <FadeIn>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 text-center">Capabilities</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-16">
            Everything a perp trader needs
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.05}>
              <div className="bg-background p-8 h-full hover:bg-secondary/50 transition-colors">
                <f.icon className="h-5 w-5 text-foreground mb-4" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
