import { useNavigate } from "react-router-dom";
import { FadeIn } from "./FadeIn";
import { Terminal } from "lucide-react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 border-t border-border">
      <div className="container">
        <FadeIn>
          <div className="max-w-xl mx-auto text-center">
            <Terminal className="h-8 w-8 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3 font-display">
              Ready to deploy your first agent?
            </h2>
            <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
              Create an autonomous trading agent with its own Solana wallet in under 2 minutes.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="text-[10px] font-bold tracking-widest uppercase bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
            >
              Launch Platform
            </button>
          </div>
        </FadeIn>

        <div className="mt-16 flex flex-wrap justify-center gap-6 text-[10px] text-muted-foreground tracking-wider uppercase">
          <span>© 2026 PerpBot</span>
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Discord</a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
