import { useNavigate } from "react-router-dom";
import { FadeIn } from "./FadeIn";
import { useEffect, useState } from "react";
import { BookOpen, LayoutDashboard, Copy, Check } from "lucide-react";

const CA = "BrhRyjcBsTzswJ1J8NWeoz5CHHS4f6NZ6BkHA4QWpump";

const terminalLines = [
  { prefix: "◉", text: "luna agent", color: "text-primary" },
];

const Hero = () => {
  const navigate = useNavigate();
  const [showCursor, setShowCursor] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyCA = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Logo + tagline */}
          <div>
            <FadeIn>
              {/* ASCII-style large logo */}
              <pre className="text-primary font-mono text-[10px] sm:text-xs leading-tight mb-8 select-none" aria-hidden="true">
{`
 ██╗     ██╗   ██╗███╗   ██╗ █████╗ 
 ██║     ██║   ██║████╗  ██║██╔══██╗
 ██║     ██║   ██║██╔██╗ ██║███████║
 ██║     ██║   ██║██║╚██╗██║██╔══██║
 ███████╗╚██████╔╝██║ ╚████║██║  ██║
 ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝
`}
              </pre>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-8">
                A unique social media with limited usernames. Claim yours before it's gone.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/docs")}
                  className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground border border-border rounded-full px-4 py-2 hover:text-foreground hover:border-foreground/30 transition-all"
                >
                  <BookOpen className="h-3.5 w-3.5" /> Docs
                </button>
                <button
                  onClick={() => navigate("/auth")}
                  className="flex items-center gap-2 text-[11px] font-mono text-primary-foreground bg-primary border border-primary rounded-full px-4 py-2 hover:bg-primary/90 transition-all active:scale-95"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" /> Platform
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="mt-6">
                <span className="text-[9px] text-muted-foreground font-mono tracking-wider uppercase mb-1.5 block">Contract Address</span>
                <button
                  onClick={copyCA}
                  className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2 transition-all w-fit"
                >
                  <span className="break-all">{CA}</span>
                  {copied ? <Check className="h-3 w-3 text-primary shrink-0" /> : <Copy className="h-3 w-3 shrink-0" />}
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Right — Terminal */}
          <FadeIn delay={0.3}>
            <div className="bg-[hsl(0_0%_7%)] border border-border rounded-xl overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-negative" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(40,80%,50%)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <span className="text-[10px] text-muted-foreground tracking-wider font-mono">erl@luna</span>
              </div>

              {/* Terminal body */}
              <div className="p-5 min-h-[260px] font-mono text-xs">
                <div className="text-muted-foreground mb-4">$ luna init</div>
                {terminalLines.map((line, i) => (
                  <div key={i} className={`${line.color} flex gap-2 mb-1`}>
                    <span>{line.prefix}</span>
                    <span>{line.text}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center gap-1">
                  <span className={`inline-block w-2 h-4 bg-primary ${showCursor ? "opacity-100" : "opacity-0"}`} />
                </div>
                <div className="mt-8 text-muted-foreground/50 text-[10px]">
                  Click to launch platform
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <FadeIn delay={0.6}>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-mono">scroll</span>
          <div className="w-px h-8 bg-border" />
        </div>
      </FadeIn>
    </section>
  );
};

export default Hero;
