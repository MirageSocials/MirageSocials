const CTA = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
            Ready to automate?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Deploy your first perp trading bot in under 2 minutes.
          </p>
          <button className="text-sm font-medium bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Launch PerpBot →
          </button>
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
          <span>© 2026 PerpBot</span>
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">Discord</a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
