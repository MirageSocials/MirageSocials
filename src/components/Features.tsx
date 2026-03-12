import { FadeIn } from "./FadeIn";
import { Crosshair, TrendingUp, Newspaper, Shield, BarChart3, Bell } from "lucide-react";

const features = [
  { icon: Crosshair, title: "Precision Scalping", desc: "High-frequency entries on 1m-5m charts with tight risk management and automatic position sizing." },
  { icon: TrendingUp, title: "Swing Trading", desc: "Capture multi-day moves by riding trend reversals and breakouts with optimized entry timing." },
  { icon: Newspaper, title: "News Reactive", desc: "Auto-enters positions on market-moving news and real-time sentiment analysis." },
  { icon: Shield, title: "Smart Risk Engine", desc: "Dynamic SL/TP with trailing stops that adapt to real-time volatility and market conditions." },
  { icon: BarChart3, title: "Multi-Exchange", desc: "Execute across Binance, Bybit, dYdX, GMX with best-price routing and minimal slippage." },
  { icon: Bell, title: "Instant Alerts", desc: "Get notified via Telegram and webhooks for every trade entry, exit, and risk event." },
];

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="container">
        <FadeIn>
          <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3 text-center">Capabilities</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-4 font-display">
            Everything you need to trade smarter
          </h2>
          <p className="text-muted-foreground text-center max-w-md mx-auto mb-16">
            Professional-grade tools, accessible to everyone.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.05}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/30 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
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
