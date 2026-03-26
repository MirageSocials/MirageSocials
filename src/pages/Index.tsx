import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, MessageSquare, TrendingUp, Users, Hash, Shield, Sparkles, Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { useRef, useEffect, useCallback } from "react";

// Animated particle/dot grid background
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const time = Date.now() * 0.001;

    ctx.clearRect(0, 0, w, h);

    // Floating particles
    const particles = 60;
    for (let i = 0; i < particles; i++) {
      const seed = i * 137.508;
      const x = ((seed * 7.31) % w);
      const y = ((seed * 3.97 + time * (15 + (i % 5) * 3)) % h);
      const size = 1 + (i % 3) * 0.5;
      const alpha = 0.08 + Math.sin(time + i) * 0.04;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(204, 88%, 53%, ${alpha})`;
      ctx.fill();
    }

    // Subtle grid dots
    const spacing = 60;
    for (let x = 0; x < w; x += spacing) {
      for (let y = 0; y < h; y += spacing) {
        const dist = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2);
        const maxDist = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);
        const alpha = 0.03 * (1 - dist / maxDist);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(204, 88%, 53%, ${alpha})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

// Animated mock feed card
const MockFeedCard = ({ avatar, name, handle, content, time, likes, replies, reposts, delay }: {
  avatar: string; name: string; handle: string; content: string; time: string;
  likes: number; replies: number; reposts: number; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="flex gap-3 px-4 py-3 border-b border-border/50 hover:bg-secondary/20 transition-colors"
  >
    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
      {avatar}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-bold text-foreground">{name}</span>
        <span className="text-muted-foreground">@{handle}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{time}</span>
      </div>
      <p className="text-foreground text-[14px] leading-relaxed mt-1">{content}</p>
      <div className="flex items-center gap-6 mt-2.5">
        <span className="flex items-center gap-1 text-muted-foreground text-xs"><MessageCircle className="h-3.5 w-3.5" />{replies}</span>
        <span className="flex items-center gap-1 text-muted-foreground text-xs"><Repeat2 className="h-3.5 w-3.5" />{reposts}</span>
        <span className="flex items-center gap-1 text-muted-foreground text-xs"><Heart className="h-3.5 w-3.5" />{likes}</span>
        <span className="flex items-center gap-1 text-muted-foreground text-xs"><Bookmark className="h-3.5 w-3.5" /></span>
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
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const launch = () => navigate(user ? "/feed" : "/auth");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* ── Floating Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-1 bg-card/70 backdrop-blur-2xl border border-border/50 rounded-full px-5 py-2.5 shadow-2xl shadow-background/50">
          <span className="font-black text-lg tracking-tight mr-4 text-foreground">
            𝕏itter<span className="text-primary">_</span>
          </span>
          <div className="hidden sm:flex items-center gap-0.5">
            {["feed", "explore", "messages"].map((link) => (
              <button
                key={link}
                onClick={() => navigate(user ? `/${link}` : "/auth")}
                className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-secondary/50 transition-all"
              >
                {link}
              </button>
            ))}
          </div>
          <button
            onClick={launch}
            className="ml-3 bg-primary text-primary-foreground text-xs font-bold px-5 py-2 rounded-full hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-1.5"
          >
            launch app <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Particle field background */}
        <ParticleField />

        {/* Ambient glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5" /> built on solana · social trading
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6"
            >
              every trade
              <br />
              <span className="relative">
                tells a story
                <span className="text-primary">.</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full origin-left"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-muted-foreground text-lg max-w-md mb-10 leading-relaxed"
            >
              share your trades. follow top traders. discuss in threads. the social layer for on-chain trading.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 mb-12"
            >
              <button
                onClick={launch}
                className="group bg-primary text-primary-foreground font-bold text-sm px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                launch app
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                learn more ↓
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-8"
            >
              {[
                { value: "∞", label: "free posts" },
                { value: "#tags", label: "trending" },
                { value: "<1s", label: "realtime" },
                { value: "SOL", label: "powered" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black tracking-tight text-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Live Feed Preview */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Phone-like frame */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl shadow-primary/5">
                {/* Feed header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="font-black text-sm text-foreground">𝕏itter<span className="text-primary">_</span></span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium">For you</span>
                    <span className="px-3 py-1 rounded-full text-muted-foreground">Following</span>
                  </div>
                </div>

                {/* Mock posts with staggered animation */}
                <div className="max-h-[420px] overflow-hidden">
                  {mockFeed.map((post, i) => (
                    <MockFeedCard key={i} {...post} delay={0.6 + i * 0.15} />
                  ))}
                </div>
              </div>

              {/* Decorative glow behind */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl -z-10 blur-xl" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-8 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Bento Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            everything you need<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            a full-featured social trading platform, built for speed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: MessageSquare, label: "threads", title: "full conversations with context", desc: "every reply builds a thread. see the full conversation in one place.", span: "lg:col-span-2" },
            { icon: Hash, label: "hashtags", title: "discover what's trending", desc: "use #hashtags to categorize posts. explore trending topics in real-time.", span: "" },
            { icon: Zap, label: "realtime", title: "instant updates, zero refresh", desc: "notifications, messages, and feed updates arrive the moment they happen.", span: "" },
            { icon: Users, label: "social", title: "follow top traders", desc: "build your network. DM anyone. get notified when your favorites post.", span: "" },
            { icon: Shield, label: "on-chain", title: "powered by solana", desc: "reserve usernames with SOL. on-chain verification for premium features.", span: "" },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 ${feature.span}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-primary font-mono text-[10px] font-bold tracking-widest uppercase">{feature.label}</span>
                <h3 className="text-xl font-black mt-2 mb-2 text-foreground">{feature.title}<span className="text-primary">.</span></h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            how it works<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground">three steps. under a minute.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "sign up", desc: "create your account. a profile is set up automatically." },
            { num: "02", title: "post & engage", desc: "share your thoughts, use #hashtags, reply to threads, repost what you love." },
            { num: "03", title: "build your network", desc: "follow traders, get notifications, DM anyone. grow your reach." },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all group"
            >
              <span className="text-6xl font-black text-primary/10 absolute top-4 right-6 group-hover:text-primary/20 transition-colors">{step.num}</span>
              <div className="relative">
                <span className="text-primary font-mono text-sm font-bold">{step.num}</span>
                <h3 className="text-xl font-black mt-3 mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-card border border-border rounded-3xl p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-foreground">
              start posting<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              join the conversation. share your trades, follow the best, and build your network.
            </p>
            <button
              onClick={launch}
              className="group bg-primary text-primary-foreground font-bold text-sm px-10 py-4 rounded-full hover:bg-primary/90 transition-all active:scale-95 inline-flex items-center gap-2 shadow-xl shadow-primary/25"
            >
              launch app <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-black text-sm text-foreground">𝕏itter<span className="text-primary">_</span></span>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>© 2026 Xitter</span>
            <button onClick={() => navigate("/auth")} className="hover:text-foreground transition-colors">Sign in</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
