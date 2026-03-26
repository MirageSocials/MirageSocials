import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, MessageSquare, TrendingUp, Users, Hash, Shield, Sparkles } from "lucide-react";
import { useRef } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
        <div className="flex items-center gap-1 bg-card/60 backdrop-blur-2xl border border-border/50 rounded-full px-5 py-2.5 shadow-2xl shadow-primary/5">
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
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Ambient background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
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
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-6"
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
            className="text-muted-foreground text-lg sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed"
          >
            share your trades. follow top traders. discuss in threads. the social layer for on-chain trading.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-4"
          >
            <button
              onClick={launch}
              className="group bg-primary text-primary-foreground font-bold text-sm px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/25"
            >
              launch app
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-5 py-3.5"
            >
              learn more ↓
            </button>
          </motion.div>

          {/* Live stats ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center justify-center gap-8 sm:gap-12 mt-16"
          >
            {[
              { value: "∞", label: "free posts" },
              { value: "#tags", label: "trending" },
              { value: "<1s", label: "realtime" },
              { value: "SOL", label: "powered" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
