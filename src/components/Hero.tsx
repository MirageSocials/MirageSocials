import { useNavigate } from "react-router-dom";
import { FadeIn } from "./FadeIn";
import { useEffect, useState } from "react";

const terminalLines = [
  { prefix: "$", text: "perpbot init --chain solana", color: "text-foreground" },
  { prefix: "◉", text: "PerpBot v2.0.0", color: "text-primary" },
  { prefix: "", text: "Generating agent wallet...", color: "text-muted-foreground" },
  { prefix: "✓", text: "Wallet: 7xKXt...9fQm (Solana)", color: "text-primary" },
  { prefix: "", text: "Loading strategy: Scalper", color: "text-muted-foreground" },
  { prefix: "✓", text: "Agent deployed. Scanning markets...", color: "text-primary" },
  { prefix: "", text: "LONG BTC/USDT @ $67,420 — size $500", color: "text-foreground" },
  { prefix: "✓", text: "TP hit +4.2% → +$21.00", color: "text-primary" },
];

const Hero = () => {
  const navigate = useNavigate();
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= terminalLines.length) return prev;
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-28 pb-20 min-h-screen flex items-center relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-primary border border-primary/20 rounded-full px-3 py-1 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Now Live on Solana
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight text-foreground mb-6 font-display">
                Autonomous
                <br />
                <span className="glow-green text-primary">Trading Agents</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-10">
                Deploy AI-powered agents with their own Solana wallets. Each agent
                trades perpetual futures 24/7 with configurable strategies and risk parameters.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/auth")}
                  className="text-[10px] font-bold tracking-widest uppercase bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                >
                  Launch Platform
                </button>
                <button
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  scroll ↓
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Right — Terminal */}
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="bg-card border border-border rounded-xl overflow-hidden scanlines relative">
                {/* Title bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-negative" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[hsl(40,80%,50%)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground tracking-wider">erl@perpbot</span>
                </div>

                {/* Terminal body */}
                <div className="p-4 min-h-[280px] font-mono text-xs space-y-1.5">
                  {terminalLines.slice(0, visibleLines).map((line, i) => (
                    <div key={i} className={`${line.color} flex gap-2`}>
                      {line.prefix && (
                        <span className={line.prefix === "✓" ? "text-primary" : line.prefix === "◉" ? "text-primary" : "text-muted-foreground"}>
                          {line.prefix}
                        </span>
                      )}
                      <span>{line.text}</span>
                    </div>
                  ))}
                  {visibleLines < terminalLines.length && (
                    <span className="inline-block w-2 h-4 bg-primary terminal-cursor" />
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Stats bar */}
        <FadeIn delay={0.5}>
          <div className="flex justify-end gap-8 mt-16">
            {[
              { value: "2.4K", label: "AGENTS" },
              { value: "$48M+", label: "VOLUME" },
              { value: "99.9%", label: "UPTIME" },
            ].map((s) => (
              <div key={s.label} className="text-right">
                <div className="text-lg font-bold text-foreground font-display">{s.value}</div>
                <div className="text-[9px] tracking-widest text-muted-foreground uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Hero;
