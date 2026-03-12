const CTA = () => {
  return (
    <section className="py-24 border-t border-border">
      <div className="container text-center">
        <h2 className="font-mono text-4xl font-bold mb-4">
          Ready to <span className="text-primary glow-text">trade?</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Deploy your first perp trading bot in under 2 minutes. Choose your pair, pick a strategy, and let the bot handle the rest.
        </p>
        <button className="font-mono text-sm uppercase tracking-widest bg-primary text-primary-foreground px-8 py-4 rounded hover:opacity-90 transition-opacity glow-primary">
          ⚡ Launch PerpBot →
        </button>
        <div className="mt-16 pt-8 border-t border-border flex flex-wrap justify-center gap-8 font-mono text-xs text-muted-foreground uppercase tracking-widest">
          <span>© 2026 PerpBot</span>
          <a href="#" className="hover:text-primary transition-colors">Docs</a>
          <a href="#" className="hover:text-primary transition-colors">Twitter</a>
          <a href="#" className="hover:text-primary transition-colors">Discord</a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
