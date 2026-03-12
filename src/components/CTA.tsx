import { useNavigate } from "react-router-dom";
import { FadeIn } from "./FadeIn";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section id="cta" className="py-24">
      <div className="container">
        <FadeIn>
          <div className="rounded-2xl bg-foreground p-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-background mb-3">
              Start trading on autopilot
            </h2>
            <p className="text-background/60 max-w-md mx-auto mb-8">
              Deploy your first bot in under 2 minutes. No coding required.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm font-medium bg-background text-foreground px-8 py-3.5 rounded-full hover:bg-background/90 transition-all active:scale-95"
            >
              Open Dashboard →
            </button>
          </div>
        </FadeIn>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs text-muted-foreground">
          <span>© 2026 PerpBot</span>
          <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Discord</a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
