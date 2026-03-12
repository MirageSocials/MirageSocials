import { useNavigate } from "react-router-dom";
import { FadeIn } from "./FadeIn";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-24">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary border border-border rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
              Live on 5+ exchanges
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-foreground mb-6">
              Perpetual futures,<br />
              fully automated.
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto mb-10">
              Select a pair, pick your strategy, set your risk — PerpBot handles the rest. 24/7 execution across every major exchange.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm font-medium bg-foreground text-background px-8 py-3.5 rounded-full hover:bg-foreground/90 transition-all active:scale-95"
              >
                Open Dashboard
              </button>
              <button
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works ↓
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex justify-center gap-12 mt-16 pt-8 border-t border-border">
              {[
                { value: "$48M+", label: "Volume Traded" },
                { value: "2,400+", label: "Active Bots" },
                { value: "67%", label: "Avg. Win Rate" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Hero;
