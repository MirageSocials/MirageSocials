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
    <footer className="py-12 border-t border-border">
      <div className="container">
        <FadeIn>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={copyCA}
              className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 transition-all"
            >
              <span>CA: {CA.slice(0, 6)}...{CA.slice(-4)}</span>
              {copied ? <Check className="h-2.5 w-2.5 text-primary" /> : <Copy className="h-2.5 w-2.5" />}
            </button>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] text-muted-foreground tracking-wider uppercase font-mono">
              <span>© 2026 Luna Agent</span>
              <a href="/docs" className="hover:text-foreground transition-colors">Docs</a>
              <a href="https://x.com/MirageSocials" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="https://github.com/MirageSocials" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1"><Github className="h-3 w-3" />GitHub</a>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
};

export default CTA;
