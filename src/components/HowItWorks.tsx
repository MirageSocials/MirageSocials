const steps = [
  { num: "01", icon: "◆", title: "Select Pair", desc: "Choose any crypto pair — BTC, ETH, SOL, or any supported perp market." },
  { num: "02", icon: "◎", title: "Pick Strategy", desc: "Scalping for quick gains, swing trading for trends, or news-based for event-driven moves." },
  { num: "03", icon: "◆", title: "Set SL / TP", desc: "Configure your stop-loss and take-profit levels, or let the bot optimize automatically." },
  { num: "04", icon: "◆", title: "Auto-Trade", desc: "The bot executes trades 24/7 based on your strategy. Monitor P&L in real-time." },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-24">
      <div className="container">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">01 · Process</span>
          <h2 className="font-mono text-4xl font-bold mt-3">
            How it <span className="text-primary">works</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg">
            Select your pair, choose a strategy, set risk parameters, and let PerpBot handle everything else.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="border border-border rounded-lg p-6 bg-card hover:border-primary/40 transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs text-muted-foreground">{step.num}</span>
                <span className="text-primary text-lg">{step.icon}</span>
              </div>
              <h3 className="font-mono text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
