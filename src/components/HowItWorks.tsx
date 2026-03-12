import { FadeIn } from "./FadeIn";

const steps = [
  { num: "01", title: "Connect Exchange", desc: "Link your Binance, Bybit, or dYdX account with read-only API keys." },
  { num: "02", title: "Choose Pair & Strategy", desc: "Pick any perp market and select from scalp, swing, trend, or news-based." },
  { num: "03", title: "Configure Risk", desc: "Set stop-loss, take-profit, and position size — or let the bot optimize." },
  { num: "04", title: "Go Live", desc: "Your bot runs 24/7. Monitor P&L, adjust settings, or pause anytime." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary">
      <div className="container">
        <FadeIn>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 text-center">Process</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-4">
            Four steps to autopilot
          </h2>
          <p className="text-muted-foreground text-center max-w-md mx-auto mb-16">
            From zero to fully automated perp trading in under two minutes.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div className="bg-background rounded-2xl p-6 h-full border border-border">
                <span className="text-xs font-mono font-semibold text-muted-foreground">{step.num}</span>
                <h3 className="text-base font-semibold mt-3 mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
