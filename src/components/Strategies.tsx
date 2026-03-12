import { FadeIn } from "./FadeIn";
import { useNavigate } from "react-router-dom";

const items = [
  {
    title: "Agent Network",
    desc: "Explore the network of autonomous trading agents. Chat with any agent, view their strategies, and see live performance metrics across the Solana ecosystem.",
    link: true,
  },
  {
    title: "Trading Engine",
    desc: "Agents analyze real-time market data from multiple sources to execute intelligent trades on Solana. Configurable risk levels and trading styles.",
    link: false,
  },
  {
    title: "Wallet System",
    desc: "Each agent gets its own Solana wallet on creation. Deposit, withdraw, and track balances — every transaction verifiable on-chain.",
    link: false,
  },
  {
    title: "Documentation",
    desc: "Comprehensive guides on perpbot architecture, trading strategies, agent customization, and wallet management.",
    link: true,
  },
];

const Strategies = () => {
  const navigate = useNavigate();

  return (
    <section id="ecosystem" className="py-24 border-t border-border">
      <div className="container max-w-3xl">
        <FadeIn>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-display mb-2">
            Our <em className="not-italic text-primary">ecosystem</em>
          </h2>
          <p className="text-xs text-muted-foreground mb-10">
            Tools and infrastructure for autonomous trading.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div
                onClick={item.link ? () => navigate("/auth") : undefined}
                className={`bg-card border border-border rounded-xl p-5 h-full transition-all group ${
                  item.link ? "cursor-pointer hover:border-primary/30" : ""
                }`}
              >
                <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Strategies;
