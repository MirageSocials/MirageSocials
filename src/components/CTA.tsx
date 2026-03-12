import { useNavigate } from "react-router-dom";
import { FadeIn } from "./FadeIn";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section id="cta" className="py-24">
      <div className="container">
        <FadeIn>
          <div className="rounded-2xl bg-primary p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground mb-3 font-display">
                Ready to trade smarter?
              </h2>
              <p className="text-primary-foreground/70 max-w-md mx-auto mb-8">
                Deploy your first bot in under 2 minutes. No coding required, no credit card needed.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="text-sm font-medium bg-primary-foreground text-primary px-8 py-3.5 rounded-full hover:bg-primary-foreground/90 transition-all active:scale-95 inline-flex items-center gap-2"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </button>
            </div>
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
