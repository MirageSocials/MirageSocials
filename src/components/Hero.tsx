import { useNavigate } from "react-router-dom";
import { FadeIn } from "./FadeIn";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-24">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
              Trusted by 2,400+ traders worldwide
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-foreground mb-6 font-display">
              Automate your perpetual
              <br />
              futures trading
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
              Deploy AI-powered bots that trade 24/7 across major exchanges. Set your strategy, define your risk, and let PerpBot execute with precision.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/auth")}
                className="text-sm font-medium bg-primary text-primary-foreground px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                See how it works ↓
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex justify-center gap-8 sm:gap-16 mt-16 pt-8 border-t border-border">
              {[
                { icon: TrendingUp, value: "$48M+", label: "Volume Traded" },
                { icon: Zap, value: "67%", label: "Avg. Win Rate" },
                { icon: Shield, value: "99.9%", label: "Uptime" },
              ].map((s) => (
                <div key={s.label} className="text-center flex flex-col items-center">
                  <s.icon className="h-4 w-4 text-primary mb-2" />
                  <div className="text-2xl font-bold text-foreground font-display">{s.value}</div>
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
