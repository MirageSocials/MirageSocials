import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sun, Moon, Check, X, Loader2 } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";

const LandingScene = lazy(() => import("@/components/LandingScene"));

const mockPosts = [
  { user: "elonmusk", time: "2m", text: "mass adoption is inevitable. the question is whether you're building or watching. also, doge to mars 🚀", price: "$2.40", mode: "rocket", earned: "$18.50", avatar: "https://pbs.twimg.com/profile_images/1893803697185910784/Na5lOWi5_400x400.jpg" },
  { user: "realDonaldTrump", time: "5m", text: "this platform is TREMENDOUS. maybe the best platform ever created. many people are saying it. HUGE!", price: "$1.00", mode: "flat", earned: "$7.20", avatar: "https://pbs.twimg.com/profile_images/1929325043513528320/gS4mUGJi_400x400.jpg" },
  { user: "cz_binance", time: "8m", text: "funds are safu. building through the cycle. ignore the noise, focus on fundamentals. 4.", price: "$4.80", mode: "stolen", earned: "$3.10", avatar: "https://pbs.twimg.com/profile_images/1917338875175485441/TjOMOOF2_400x400.jpg" },
  { user: "solana", time: "12m", text: "400ms block times. 65k tps. sub-cent fees. the chain doesn't sleep and neither do we.", price: "$0.50", mode: "dutch", earned: "$2.30", avatar: "https://pbs.twimg.com/profile_images/1855977741537886208/cuXy3SMY_400x400.jpg" },
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
    <div className="min-h-screen bg-[hsl(220,20%,4%)] text-[hsl(220,10%,90%)] selection:bg-primary/20 overflow-x-hidden">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <LandingScene />
      </Suspense>

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center pt-4 pb-2 z-50 sticky top-0"
        >
          <div className="flex items-center gap-1 bg-[hsl(220,20%,7%)/0.8] backdrop-blur-xl border border-[hsl(220,15%,14%)] rounded-full px-5 py-2.5 shadow-lg shadow-black/30">
            <span className="font-semibold text-[14px] tracking-tight mr-5 text-[hsl(220,10%,90%)] flex items-center gap-2">
              <img src={logoImg} alt="Mirage" className="w-6 h-6 rounded" />
              mirage<span className="text-primary font-mono">_</span>
            </span>
            {["feed", "marketplace", "docs"].map((link) => (
              <button
                key={link}
                onClick={() => navigate(user ? `/${link}` : "/auth")}
                className="text-[13px] text-[hsl(220,10%,45%)] hover:text-[hsl(220,10%,90%)] px-3 py-1.5 rounded-lg transition-colors"
              >
                {link}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full text-[hsl(220,10%,45%)] hover:text-[hsl(220,10%,90%)] hover:bg-[hsl(220,15%,12%)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={launch}
              className="ml-2 bg-primary text-primary-foreground text-[13px] font-medium px-5 py-2 rounded-full hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg shadow-primary/20"
            >
              launch app <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.nav>

        {/* Main content */}
        <div className="flex items-center justify-center px-6 py-12 lg:py-24">
          <div className="max-w-6xl w-full">
            <div className="bg-[hsl(220,20%,7%)/0.6] backdrop-blur-md border border-[hsl(220,15%,14%)/0.6] rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl shadow-black/40">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Left — Hero text */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  <p className="text-primary text-sm font-mono mb-6 glow-text">built on solana · limited usernames</p>

                  <h1 className="text-[clamp(32px,4.5vw,56px)] font-bold tracking-[-0.04em] leading-[1.1] mb-6 text-[hsl(220,10%,95%)]">
                    Mirage
                    <br />
                    Socials<span className="text-primary glow-text-strong">.</span>
                  </h1>

                  <p className="text-[hsl(220,10%,50%)] text-[15px] leading-relaxed mb-8 max-w-sm">
                    a unique social media with limited usernames.
                    claim yours before it's gone.
                  </p>

                  <div className="flex items-center gap-4 mb-10">
                    <button
                      onClick={launch}
                      className="group rounded-full bg-primary px-7 py-3 text-[14px] font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] flex items-center gap-2 shadow-lg shadow-primary/30 glow-primary"
                    >
                      launch app <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <button
                      onClick={() => navigate("/docs")}
                      className="text-[14px] text-[hsl(220,10%,45%)] hover:text-[hsl(220,10%,90%)] transition-colors flex items-center gap-1"
                    >
                      api docs <span className="text-[hsl(220,10%,30%)]">→</span>
                    </button>
                  </div>

                  {/* Animated Stats */}
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-xl md:text-2xl font-bold font-mono text-[hsl(220,10%,95%)]">
                        <AnimatedNumber value={0.10} prefix="$" />
                      </div>
                      <div className="text-[11px] text-[hsl(220,10%,40%)] mt-0.5">min post</div>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-bold font-mono text-[hsl(220,10%,95%)]">
                        <AnimatedNumber value={2} suffix="x" />
                      </div>
                      <div className="text-[11px] text-[hsl(220,10%,40%)] mt-0.5">steal price</div>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-bold font-mono text-[hsl(220,10%,95%)]">
                        {"<"}<AnimatedNumber value={1} suffix="s" />
                      </div>
                      <div className="text-[11px] text-[hsl(220,10%,40%)] mt-0.5">settlement</div>
                    </div>
                  </div>
                </motion.div>

                {/* Right — Mock feed */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="bg-[hsl(220,20%,7%)/0.9] border border-[hsl(220,15%,14%)] rounded-2xl overflow-hidden shadow-xl shadow-black/30 glow-card"
                >
                  <div className="flex items-center justify-between px-5 py-3 border-b border-[hsl(220,15%,14%)]">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm text-[hsl(220,10%,90%)] flex items-center gap-1.5"><img src={logoImg} alt="" className="w-4 h-4 rounded" />mirage<span className="text-primary font-mono">_</span></span>
                      <span className="text-primary text-xs font-medium border-b-2 border-primary pb-0.5">feed</span>
                      <span className="text-[hsl(220,10%,40%)] text-xs">versus</span>
                      <span className="text-[hsl(220,10%,40%)] text-xs">board</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-mono text-sm font-bold glow-text">$42.80</span>
                      <span className="text-[hsl(220,10%,40%)] text-xs">@you</span>
                    </div>
                  </div>

                  <div className="divide-y divide-[hsl(220,15%,14%)]">
                    {mockPosts.map((post, i) => (
                      <div key={i} className="px-5 py-4 flex gap-3">
                        <img src={post.avatar} alt={post.user} className="w-8 h-8 rounded-full object-cover shrink-0 border border-[hsl(220,15%,14%)]" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-[hsl(220,10%,90%)]">@{post.user}</span>
                            <span className="text-xs text-[hsl(220,10%,40%)]">{post.time}</span>
                          </div>
                          <p className="text-sm text-[hsl(220,10%,50%)] leading-relaxed">{post.text}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-primary font-mono">{post.mode}</span>
                            <span className="text-xs text-[hsl(158,64%,52%)] font-mono">{post.earned} earned</span>
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
          className="border-t border-[hsl(220,15%,14%)] bg-[hsl(220,20%,4%)/0.8] backdrop-blur-sm py-8 mt-12"
        >
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-[hsl(220,10%,40%)] font-mono flex items-center gap-2"><img src={logoImg} alt="Mirage" className="w-5 h-5 rounded" /> © 2026 mirage</span>
            <div className="flex items-center gap-6 text-sm text-[hsl(220,10%,40%)]">
              <button onClick={() => navigate("/docs")} className="hover:text-[hsl(220,10%,90%)] transition-colors">Docs</button>
              <a href="https://x.com/MirageSocials" target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(220,10%,90%)] transition-colors">Twitter</a>
              <a href="https://github.com/MirageSocials" target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(220,10%,90%)] transition-colors">GitHub</a>
              <button onClick={() => navigate("/marketplace")} className="hover:text-[hsl(220,10%,90%)] transition-colors">Marketplace</button>
              <button onClick={() => navigate("/terms")} className="hover:text-[hsl(220,10%,90%)] transition-colors">Terms</button>
              <button onClick={() => navigate("/privacy")} className="hover:text-[hsl(220,10%,90%)] transition-colors">Privacy</button>
              <button onClick={() => navigate("/contact")} className="hover:text-[hsl(220,10%,90%)] transition-colors">Contact</button>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
