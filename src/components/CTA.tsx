import { FadeIn } from "./FadeIn";
import { Copy, Check, Github } from "lucide-react";
import { useState } from "react";

const CA = "BrhRyjcBsTzswJ1J8NWeoz5CHHS4f6NZ6BkHA4QWpump";

const CTA = () => {
  const [copied, setCopied] = useState(false);

  const copyCA = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <footer className="py-6 border-t border-border">
      <div className="container">
        <FadeIn>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <button
                  onClick={copyCA}
                  className="flex items-center gap-1.5 hover:text-foreground border border-border rounded-full px-2.5 py-1 transition-all"
                >
                  <span className="text-[9px]">CA: {CA.slice(0, 6)}...{CA.slice(-4)}</span>
                  {copied ? <Check className="h-2.5 w-2.5 text-primary" /> : <Copy className="h-2.5 w-2.5" />}
                </button>
                <span className="text-[11px]">© 2026 Mirage</span>
              </div>
              <nav className="flex flex-wrap items-center gap-6 text-[11px] text-muted-foreground tracking-wider font-mono">
                <a href="/docs" className="hover:text-foreground transition-colors">Docs</a>
                <a href="https://x.com/MirageSocials" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
                <a href="https://github.com/MirageSocials" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1"><Github className="h-3 w-3" />GitHub</a>
                <a href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</a>
                <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
              </nav>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
};

export default CTA;
