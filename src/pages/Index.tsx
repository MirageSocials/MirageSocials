import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const mockPosts = [
  { user: "satoshi", time: "2m", text: "bitcoin will hit $500k this cycle. not financial advice but also financial advice.", price: "$2.40", mode: "rocket", earned: "$18.50", color: "bg-primary" },
  { user: "vitalik", time: "5m", text: "the future of social media is putting money where your mouth is. literally.", price: "$1.00", mode: "flat", earned: "$7.20", color: "bg-accent" },
  { user: "trader_joe", time: "8m", text: "just stole this post for $4.80. worth every penny.", price: "$4.80", mode: "stolen", earned: "$3.10", color: "bg-destructive" },
  { user: "based_dev", time: "12m", text: "building on mirage rn. the api is actually clean.", price: "$0.50", mode: "dutch", earned: "$2.30", color: "bg-secondary" },
];

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1.5 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value * 100) / 100);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>{prefix}{display % 1 === 0 ? display : display.toFixed(2)}{suffix}</span>;
}

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const launch = () => navigate(user ? "/feed" : "/auth");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(195,80%,92%)] via-[hsl(200,60%,95%)] to-[hsl(190,70%,90%)] dark:from-background dark:via-background dark:to-background text-foreground selection:bg-primary/20">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center pt-4 pb-2 z-50 sticky top-0"
      >
        <div className="flex items-center gap-1 bg-card/80 backdrop-blur-xl border border-border rounded-full px-5 py-2.5 shadow-lg">
          <span className="font-semibold text-[14px] tracking-tight mr-5 text-foreground">
            mirage<span className="text-primary font-mono">_</span>
          </span>
          {["feed", "marketplace", "docs"].map((link) => (
            <button
              key={link}
              onClick={() => navigate(user ? `/${link}` : "/auth")}
              className="text-[13px] text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
            >
              {link}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={launch}
            className="ml-2 bg-primary text-primary-foreground text-[13px] font-medium px-5 py-2 rounded-full hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            launch app <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.nav>

      {/* Main content */}
      <div className="flex items-center justify-center px-6 py-12 lg:py-24">
        <div className="max-w-6xl w-full">
          <div className="bg-card/60 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left — Hero text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <p className="text-primary text-sm font-mono mb-6">built on solana · 0% fees</p>

                <h1 className="text-[clamp(32px,4.5vw,56px)] font-bold tracking-[-0.04em] leading-[1.1] mb-6 text-foreground">
                  every word
                  <br />
                  has a price tag<span className="text-primary">.</span>
                </h1>

                <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 max-w-sm">
                  posting costs money. replies pay the author. steal any
                  post for 2x. 100% flows to users.
                </p>

                <div className="flex items-center gap-4 mb-10">
                  <button
                    onClick={launch}
                    className="group rounded-full bg-primary px-7 py-3 text-[14px] font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    launch app <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <button
                    onClick={() => navigate("/docs")}
                    className="text-[14px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    api docs <span className="text-muted-foreground/50">→</span>
                  </button>
                </div>

                {/* Animated Stats */}
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-xl md:text-2xl font-bold font-mono text-foreground">
                      <AnimatedNumber value={0.10} prefix="$" />
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">min post</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold font-mono text-foreground">
                      <AnimatedNumber value={2} suffix="x" />
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">steal price</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold font-mono text-foreground">
                      {"<"}<AnimatedNumber value={1} suffix="s" />
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">settlement</div>
                  </div>
                </div>
              </motion.div>

              {/* Right — Mock feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sm text-foreground">xitter<span className="text-primary font-mono">_</span></span>
                    <span className="text-primary text-xs font-medium border-b-2 border-primary pb-0.5">feed</span>
                    <span className="text-muted-foreground text-xs">versus</span>
                    <span className="text-muted-foreground text-xs">board</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-mono text-sm font-bold">$42.80</span>
                    <span className="text-muted-foreground text-xs">@you</span>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {mockPosts.map((post, i) => (
                    <div key={i} className="px-5 py-4 flex gap-3">
                      <div className={`w-8 h-8 rounded-full ${post.color} flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0`}>
                        {post.user[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">@{post.user}</span>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{post.text}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-primary font-mono">{post.mode}</span>
                          <span className="text-xs text-emerald-500 font-mono">{post.earned} earned</span>
                        </div>
                      </div>
                      <span className="text-primary font-mono text-sm font-bold shrink-0">{post.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="border-t border-border bg-card/40 backdrop-blur-sm py-8 mt-12"
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground font-mono">© 2026 xitter</span>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => navigate("/docs")} className="hover:text-foreground transition-colors">Docs</button>
            <a href="https://x.com/LunaAgentPerp" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Discord</a>
            <button onClick={() => navigate("/marketplace")} className="hover:text-foreground transition-colors">Marketplace</button>
            <button onClick={() => navigate("/terms")} className="hover:text-foreground transition-colors">Terms</button>
            <button onClick={() => navigate("/privacy")} className="hover:text-foreground transition-colors">Privacy</button>
            <button onClick={() => navigate("/contact")} className="hover:text-foreground transition-colors">Contact</button>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
