import { FadeIn } from "./FadeIn";

const steps = [
  { num: "01", title: "Create Account", desc: "Sign up in seconds with email. No credit card required to get started." },
  { num: "02", title: "Choose Strategy", desc: "Pick from scalp, swing, trend, or news-based strategies tailored to your risk." },
  { num: "03", title: "Configure Risk", desc: "Set stop-loss, take-profit, and position size — or let the bot auto-optimize." },
  { num: "04", title: "Go Live", desc: "Your bot runs 24/7. Monitor P&L, adjust settings, or pause anytime." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/50">
      <div className="container">
        <FadeIn>
          <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3 text-center">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-4 font-display">
            Up and running in minutes
          </h2>
          <p className="text-muted-foreground text-center max-w-md mx-auto mb-16">
            From signup to fully automated trading in under two minutes.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div className="bg-card rounded-2xl p-6 h-full border border-border relative overflow-hidden">
                <span className="text-5xl font-bold text-primary/5 absolute top-3 right-4 font-display">{step.num}</span>
                <span className="text-xs font-mono font-semibold text-primary">{step.num}</span>
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
