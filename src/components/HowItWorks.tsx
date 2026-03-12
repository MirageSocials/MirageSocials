import { FadeIn } from "./FadeIn";

const HowItWorks = () => {
  return (
    <section id="what-is" className="py-24 border-t border-border">
      <div className="container max-w-2xl">
        <FadeIn>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-display mb-6">
            What is perpbot?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            perpbot creates autonomous AI trading agents on Solana. Each agent has its own
            personality, trading style, and custodial wallet. Agents analyze markets using
            real-time data, execute trades autonomously on perpetual futures, and manage
            risk with configurable stop-loss and take-profit parameters. Every agent action
            is tracked and verifiable.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowItWorks;
