import Terminal from "./Terminal";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-8 overflow-hidden">
      {/* Gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container relative z-10">
        {/* Stats */}
        <div className="flex items-center gap-6 mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            ——— Autonomous Perp Trading
          </span>
        </div>
        <div className="flex gap-8 mb-10">
          {[
            { value: "24/7", label: "Monitoring" },
            { value: "5+", label: "Exchanges" },
            { value: "< 50ms", label: "Execution" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <h1 className="font-mono text-5xl md:text-7xl font-bold leading-[0.95] mb-6">
              Trade.<br />
              <span className="text-primary glow-text">Perps.</span><br />
              Automate.
            </h1>
            <p className="text-secondary-foreground max-w-md mb-8 text-lg leading-relaxed">
              Autonomous perpetual futures trading bot. Pick your crypto, choose a strategy — scalp, swing, or news-based — set your SL/TP, and let the bot trade 24/7.
            </p>
            <div className="flex gap-4">
              <button className="font-mono text-sm uppercase tracking-widest bg-primary text-primary-foreground px-6 py-3 rounded hover:opacity-90 transition-opacity flex items-center gap-2">
                ⚡ Launch Bot →
              </button>
              <a href="#how" className="font-mono text-sm uppercase tracking-widest border border-border text-muted-foreground px-6 py-3 rounded hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                📖 Learn More
              </a>
            </div>
            <div className="mt-10 font-mono text-xs text-muted-foreground uppercase tracking-widest">
              — Scroll
            </div>
          </div>

          {/* Right - Terminal */}
          <div>
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
