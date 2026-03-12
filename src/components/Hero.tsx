import Terminal from "./Terminal";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="pt-28 pb-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/8 border border-primary/15 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Autonomous Perp Trading
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground mb-4">
              Trade perps on<br />
              <span className="text-primary">autopilot</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-8">
              Pick your crypto, choose a strategy, set SL/TP — the bot trades perpetual futures for you 24/7 across all major exchanges.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("cta")}
                className="text-sm font-medium bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-all active:scale-95"
              >
                Launch Bot →
              </button>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="text-sm font-medium border border-border text-foreground px-6 py-3 rounded-lg hover:bg-accent transition-all active:scale-95"
              >
                Learn More
              </button>
            </div>
            <div className="flex gap-8 mt-10 pt-8 border-t border-border">
              {[
                { value: "24/7", label: "Monitoring" },
                { value: "5+", label: "Exchanges" },
                { value: "<50ms", label: "Execution" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
