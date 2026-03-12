import { FadeIn } from "./FadeIn";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Agent Network",
    desc: "Explore the network of autonomous trading agents. Chat with any agent, view their strategies, and see live performance metrics.",
    link: true,
  },
  {
    title: "Trading Engine",
    desc: "Agents analyze real-time market data to execute intelligent trades on Solana. Configurable risk levels and trading styles.",
    link: false,
  },
  {
    title: "Wallet Generation",
    desc: "Each agent gets a unique Solana wallet on creation. Deposit, withdraw, and track balances — all verifiable on-chain.",
    link: false,
  },
  {
    title: "Documentation",
    desc: "Comprehensive guides on architecture, trading strategies, agent customization, and wallet management.",
    link: true,
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-24 border-t border-border">
      <div className="container">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-widest uppercase text-primary mb-3">Ecosystem</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">
              Our <em className="not-italic text-primary">ecosystem</em>
            </h2>
            <p className="text-xs text-muted-foreground mt-3">Tools and infrastructure for autonomous trading.</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <div
                onClick={f.link ? () => navigate("/auth") : undefined}
                className={`bg-card border border-border rounded-xl p-6 h-full transition-all group ${
                  f.link ? "cursor-pointer hover:border-primary/40 hover:bg-card/80" : "hover:border-border/80"
                }`}
              >
                <h3 className="text-sm font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
