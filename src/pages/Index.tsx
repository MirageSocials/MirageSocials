import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, MessageSquare, TrendingUp, Users, Hash, Shield, Sparkles, Heart, MessageCircle, Repeat2, Bookmark, Terminal } from "lucide-react";
import { useRef, useEffect, useCallback } from "react";

// Matrix-style rain effect
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const cols = Math.floor(w / 20);
    const drops = new Array(cols).fill(0).map(() => Math.random() * -100);
    const chars = "01アイウエオカキクケコ$¥€£₿◊∞≠≈".split("");

    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < cols; i++) {
        if (drops[i] < 0) {
          drops[i] += 0.5;
          continue;
        }
        const char = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * 16;
        
        // Head character is bright
        ctx.fillStyle = `hsla(158, 64%, 52%, ${0.6 + Math.random() * 0.3})`;
        ctx.font = "13px JetBrains Mono, monospace";
        ctx.fillText(char, i * 20, y);
        
        // Trail fades
        if (Math.random() > 0.97) {
          ctx.fillStyle = `hsla(158, 64%, 52%, 0.15)`;
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 20, y - 16);
        }

        if (y > h && Math.random() > 0.98) {
          drops[i] = Math.random() * -50;
        }
        drops[i] += 0.3 + Math.random() * 0.3;
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  );
};

// Terminal-style typing effect for the feed preview
const MockFeedCard = ({ avatar, name, handle, content, time, likes, replies, reposts, delay }: {
  avatar: string; name: string; handle: string; content: string; time: string;
  likes: number; replies: number; reposts: number; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="flex gap-3 px-4 py-3 border-b border-border/40 hover:bg-secondary/20 transition-colors"
  >
    <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-xs font-bold font-mono shrink-0">
      {avatar}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-semibold text-foreground">{name}</span>
        <span className="text-muted-foreground font-mono">@{handle}</span>
        <span className="text-muted-foreground/40">·</span>
        <span className="text-muted-foreground">{time}</span>
      </div>
      <p className="text-foreground text-[13px] leading-relaxed mt-1">{content}</p>
      <div className="flex items-center gap-5 mt-2">
        <span className="flex items-center gap-1 text-muted-foreground text-[11px] font-mono"><MessageCircle className="h-3 w-3" />{replies}</span>
        <span className="flex items-center gap-1 text-muted-foreground text-[11px] font-mono"><Repeat2 className="h-3 w-3" />{reposts}</span>
        <span className="flex items-center gap-1 text-muted-foreground text-[11px] font-mono"><Heart className="h-3 w-3" />{likes}</span>
        <Bookmark className="h-3 w-3 text-muted-foreground" />
      </div>
    </div>
  </motion.div>
);

const mockFeed = [
  { avatar: "S", name: "satoshi", handle: "satoshi", content: "bitcoin will hit $500k this cycle. not financial advice but also financial advice. 🚀", time: "2m", likes: 142, replies: 38, reposts: 67 },
  { avatar: "V", name: "vitalik.eth", handle: "vitalik", content: "the future of social media is putting money where your mouth is. literally.", time: "5m", likes: 89, replies: 24, reposts: 31 },
  { avatar: "T", name: "trader joe", handle: "trader_joe", content: "just went long $SOL at $180. LFG. #solana #trading", time: "8m", likes: 56, replies: 12, reposts: 8 },
  { avatar: "B", name: "based_dev", handle: "baseddev", content: "building on xitter rn. the feed is actually addicting. who needs twitter when you have this?", time: "12m", likes: 34, replies: 7, reposts: 15 },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const launch = () => navigate(user ? "/feed" : "/auth");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* ── Floating Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="glass flex items-center gap-1 border border-border/50 rounded-xl px-4 py-2 shadow-2xl">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center mr-3">
            <TrendingUp className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm tracking-tight mr-4 text-foreground">
            xitter<span className="text-primary font-mono">_</span>
          </span>
          <div className="hidden sm:flex items-center gap-0.5">
            {["feed", "explore", "trade"].map((link) => (
              <button
                key={link}
                onClick={() => navigate(user ? `/${link}` : "/auth")}
                className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-all font-medium"
              >
                {link}
              </button>
            ))}
          </div>
          <button
            onClick={launch}
            className="ml-3 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-lg hover:brightness-110 transition-all active:scale-95 flex items-center gap-1.5"
          >
            launch <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <MatrixRain />

        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[200px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[11px] font-mono font-semibold px-3 py-1 rounded-md mb-8"
            >
              <Terminal className="h-3 w-3" /> v1.0 · solana mainnet
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-6"
            >
              every trade
              <br />
              <span className="relative">
                <span className="gradient-text">tells a story</span>
                <span className="text-primary glow-text">.</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-muted-foreground text-base max-w-md mb-10 leading-relaxed"
            >
              share your trades. follow top traders. discuss in threads.
              <span className="text-foreground font-medium"> the social layer for on-chain trading.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-3 mb-14"
            >
              <button
                onClick={launch}
                className="group bg-primary text-primary-foreground font-bold text-sm px-7 py-3 rounded-xl hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 glow-primary"
              >
                launch app
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium px-4 py-3"
              >
                learn more ↓
              </button>
            </motion.div>

            {/* Terminal-style stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-card/50 border border-border rounded-xl p-4 max-w-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-negative" />
                <div className="w-2 h-2 rounded-full bg-primary/50" />
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] text-muted-foreground font-mono ml-2">xitter_stats.sol</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: "∞", label: "posts" },
                  { value: "#", label: "trending" },
                  { value: "<1s", label: "realtime" },
                  { value: "SOL", label: "powered" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-lg font-bold font-mono text-primary">{stat.value}</div>
                    <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Live Feed Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-negative/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-background/50 rounded-md px-8 py-0.5 text-[10px] text-muted-foreground font-mono">
                      xitter.app/feed
                    </div>
                  </div>
                </div>

                {/* Feed header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xs text-foreground">xitter<span className="text-primary font-mono">_</span></span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px]">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-semibold">For you</span>
                    <span className="px-2.5 py-0.5 rounded-md text-muted-foreground">Following</span>
                  </div>
                </div>

                <div className="max-h-[380px] overflow-hidden">
                  {mockFeed.map((post, i) => (
                    <MockFeedCard key={i} {...post} delay={0.7 + i * 0.12} />
                  ))}
                </div>
              </div>

              {/* Glow */}
              <div className="absolute -inset-6 bg-primary/5 rounded-2xl -z-10 blur-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-7 border border-muted-foreground/30 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-0.5 h-1.5 bg-primary/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-xs font-semibold tracking-widest uppercase">features</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 mb-3">
            everything you need<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            a full-featured social trading platform, built for speed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: MessageSquare, label: "threads", title: "full conversations", desc: "every reply builds a thread. see the full context in one place.", span: "lg:col-span-2" },
            { icon: Hash, label: "hashtags", title: "trending topics", desc: "use #hashtags to categorize. explore what's trending in real-time.", span: "" },
            { icon: Zap, label: "realtime", title: "instant updates", desc: "notifications, messages, and feed updates arrive the moment they happen.", span: "" },
            { icon: Users, label: "social", title: "follow traders", desc: "build your network. DM anyone. get notified when your favorites post.", span: "" },
            { icon: Shield, label: "solana", title: "on-chain native", desc: "reserve usernames with SOL. on-chain verification for premium features.", span: "" },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className={`group relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-200 ${feature.span}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-primary font-mono text-[10px] font-bold tracking-widest uppercase">{feature.label}</span>
                <h3 className="text-base font-bold mt-1.5 mb-1 text-foreground">{feature.title}<span className="text-primary">.</span></h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-mono text-xs font-semibold tracking-widest uppercase">get started</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 mb-3">
            how it works<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground text-sm">three steps. under a minute.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-3">
          {[
            { num: "01", title: "sign up", desc: "create your account. a profile is set up automatically." },
            { num: "02", title: "post & engage", desc: "share thoughts, use #hashtags, reply to threads, repost what you love." },
            { num: "03", title: "grow", desc: "follow traders, get notifications, DM anyone. build your network." },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all group overflow-hidden"
            >
              <span className="absolute -top-2 -right-1 text-5xl font-bold font-mono text-primary/5 group-hover:text-primary/10 transition-colors">{step.num}</span>
              <div className="relative">
                <span className="text-primary font-mono text-sm font-bold">{step.num}</span>
                <h3 className="text-base font-bold mt-2 mb-1.5 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-card border border-border rounded-2xl p-10 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/3 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 text-foreground">
              start posting<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
              join the conversation. share your trades, follow the best, build your network.
            </p>
            <button
              onClick={launch}
              className="group bg-primary text-primary-foreground font-bold text-sm px-8 py-3.5 rounded-xl hover:brightness-110 transition-all active:scale-95 inline-flex items-center gap-2 glow-primary"
            >
              launch app <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <TrendingUp className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-bold text-xs tracking-tight text-foreground">xitter<span className="text-primary font-mono">_</span></span>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-muted-foreground font-mono">
            <span>© 2026</span>
            <button onClick={() => navigate("/auth")} className="hover:text-foreground transition-colors">sign in</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
