import { FadeIn } from "./FadeIn";
import { User, Wallet, BarChart3, Zap, ArrowRight } from "lucide-react";

const steps = [
  { icon: User, label: "agent", title: "Create Agent" },
  { icon: Wallet, label: "◎", title: "Fund Wallet" },
  { icon: BarChart3, label: "Analyze", title: "Analyze" },
  { icon: Zap, label: "EXECUTE", title: "Execute" },
];

const actions = ["Buy", "Sell", "Hold"];

const Features = () => {
  return (
    <section id="how-it-works" className="py-24 border-t border-border">
      <div className="container max-w-3xl">
        <FadeIn>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-display mb-2">
            How it <em className="not-italic text-primary">works</em>
          </h2>
        </FadeIn>

        {/* Flow diagram */}
        <FadeIn delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {steps.map((step, i) => (
              <div key={step.title} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-xl border border-border bg-card flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] tracking-widest uppercase text-muted-foreground font-mono">{step.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-border mt-[-16px]" />
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Trade actions */}
        <FadeIn delay={0.2}>
          <div className="mt-10 flex items-center justify-center gap-2">
            {actions.map((a) => (
              <span key={a} className="text-[9px] font-mono tracking-widest uppercase border border-border rounded-full px-3 py-1 text-muted-foreground">
                {a}
              </span>
            ))}
            <span className="text-[9px] font-mono tracking-widest uppercase text-primary border border-primary/30 rounded-full px-3 py-1">
              ON-CHAIN
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-primary border border-primary/30 rounded-full px-3 py-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              LIVE
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-xs text-muted-foreground leading-relaxed mt-8 max-w-lg">
            Design your agent's unique trading strategy. Choose from Scalper, Swing Trader,
            Long-term, or Degen styles. Each agent analyzes markets and executes trades autonomously.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default Features;
