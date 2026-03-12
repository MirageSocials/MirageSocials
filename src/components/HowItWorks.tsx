import { FadeIn } from "./FadeIn";
import { User, Wallet, BarChart3, Zap } from "lucide-react";

const steps = [
  { icon: User, label: "agent", title: "Create Agent", desc: "Design your agent's trading personality and strategy — Scalper, Swing, Trend, or Degen." },
  { icon: Wallet, label: "◎", title: "Fund Wallet", desc: "Each agent gets its own Solana wallet. Deposit funds and set position sizing." },
  { icon: BarChart3, label: "analyze", title: "Analyze", desc: "Agent scans markets in real-time, identifies entries, and calculates risk/reward." },
  { icon: Zap, label: "execute", title: "Execute", desc: "Autonomous trade execution with configurable SL/TP. Runs 24/7, no downtime." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-widest uppercase text-primary mb-3">How it works</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">
              How it <em className="not-italic text-primary">works</em>
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.1}>
              <div className="bg-card border border-border rounded-xl p-5 h-full hover:border-primary/30 transition-all group relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] tracking-widest uppercase text-muted-foreground">{step.label}</span>
                </div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
