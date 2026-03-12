const steps = [
  { num: "01", title: "Select Pair", desc: "Choose any crypto — BTC, ETH, SOL, or any supported perp market." },
  { num: "02", title: "Pick Strategy", desc: "Scalping, swing trading, trend following, or news-based trading." },
  { num: "03", title: "Set SL / TP", desc: "Configure risk parameters or let the bot optimize automatically." },
  { num: "04", title: "Auto-Trade", desc: "The bot executes 24/7. Monitor your P&L in real-time." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">How it works</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Four steps to fully automated perp trading.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div key={step.num} className="rounded-xl border border-border p-6 bg-card hover:shadow-md transition-shadow">
              <span className="text-xs font-semibold text-primary">{step.num}</span>
              <h3 className="text-base font-semibold mt-2 mb-1.5 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
