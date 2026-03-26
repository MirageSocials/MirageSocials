import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, MessageCircle, Heart, Repeat2 } from "lucide-react";

const MockPost = ({ avatar, handle, content, time, earned, price, tag, delay }: {
  avatar: string; handle: string; content: string; time: string;
  earned: string; price: string; tag: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className="flex gap-3 px-4 py-3.5 border-b border-border/60"
  >
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
      {avatar}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-semibold text-foreground">@{handle}</span>
        <span className="text-muted-foreground">{time}</span>
      </div>
      <p className="text-foreground/90 text-[13px] leading-relaxed mt-1">{content}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-primary text-[11px] font-medium">{tag}</span>
        <span className="text-primary/70 text-[11px]">{earned} earned</span>
      </div>
    </div>
    <span className="text-foreground font-semibold text-sm shrink-0">{price}</span>
  </motion.div>
);

const mockPosts = [
  { avatar: "S", handle: "satoshi", content: "bitcoin will hit $500k this cycle. not financial advice but also financial advice.", time: "2m", earned: "$18.50", price: "$2.40", tag: "rocket" },
  { avatar: "V", handle: "vitalik", content: "the future of social media is putting money where your mouth is. literally.", time: "5m", earned: "$7.20", price: "$1.00", tag: "flat" },
  { avatar: "T", handle: "trader_joe", content: "just went long $SOL at $180. worth every penny.", time: "8m", earned: "$3.10", price: "$4.80", tag: "stolen" },
  { avatar: "B", handle: "based_dev", content: "building on xitter rn. the feed is actually clean.", time: "12m", earned: "$2.30", price: "$0.50", tag: "dutch" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const launch = () => navigate(user ? "/feed" : "/auth");

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 inset-x-0 z-50 flex justify-center pt-5"
      >
        <div className="flex items-center gap-1 bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl px-5 py-2.5 shadow-sm">
          <span className="font-bold text-sm tracking-tight mr-6">
            xitter<span className="text-primary font-mono">_</span>
          </span>
          {["feed", "explore", "trade", "docs"].map((link) => (
            <button
              key={link}
              onClick={() => navigate(user ? `/${link}` : "/auth")}
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
            >
              {link}
            </button>
          ))}
          <button
            onClick={launch}
            className="ml-4 bg-primary text-primary-foreground text-xs font-semibold px-5 py-2 rounded-xl hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            launch app <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary text-xs font-mono tracking-wider mb-6"
            >
              built on solana · 0% fees
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold tracking-tight leading-[1.05] mb-5"
            >
              every trade
              <br />
              tells a story<span className="text-primary">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-base max-w-sm mb-8 leading-relaxed"
            >
              share your trades. follow top traders. discuss in threads. 100% flows to users.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 mb-12"
            >
              <button
                onClick={launch}
                className="bg-primary text-primary-foreground font-semibold text-sm px-7 py-3 rounded-xl hover:brightness-110 transition-all active:scale-[0.97] flex items-center gap-2"
              >
                launch app <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/docs")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                api docs →
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center gap-8"
            >
              {[
                { value: "$0.10", label: "min post" },
                { value: "2x", label: "steal price" },
                { value: "<1s", label: "settlement" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold font-mono text-foreground">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Feed Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
              {/* Feed chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">xitter<span className="text-primary font-mono">_</span></span>
                </div>
                <div className="flex items-center gap-0.5 text-[11px]">
                  <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-medium">feed</span>
                  <span className="px-3 py-1 rounded-lg text-muted-foreground">explore</span>
                  <span className="px-3 py-1 rounded-lg text-muted-foreground">trade</span>
                </div>
                <span className="text-muted-foreground text-[11px] font-mono">$42.80 <span className="text-foreground font-medium">@you</span></span>
              </div>

              {mockPosts.map((post, i) => (
                <MockPost key={i} {...post} delay={0.6 + i * 0.1} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            how it works<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-3">three steps. under a minute.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { num: "01", title: "sign up", desc: "create your account with email or wallet. a profile is set up instantly." },
            { num: "02", title: "post & engage", desc: "share thoughts, use #hashtags, reply to threads, repost what you love." },
            { num: "03", title: "grow your network", desc: "follow traders, get notified, DM anyone. build your circle." },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <span className="text-primary font-mono text-sm font-bold">{step.num}</span>
              <h3 className="text-lg font-bold mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "threads", desc: "every reply builds a thread. see the full conversation in context." },
            { title: "hashtags", desc: "use #hashtags to categorize. explore what's trending in real-time." },
            { title: "realtime", desc: "notifications, messages, and feed updates arrive instantly." },
            { title: "on-chain", desc: "reserve usernames with SOL. on-chain verification baked in." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <span className="text-primary text-xs font-mono font-medium tracking-wider">{f.title}</span>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Fees Banner ── */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-10 md:p-16 text-center"
        >
          <div className="text-6xl sm:text-7xl font-bold font-mono text-primary mb-3">0%</div>
          <p className="text-lg font-semibold mb-1">fees</p>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            100% of everything flows directly to users.
          </p>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            start posting<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
            join the conversation. share your trades, follow the best.
          </p>
          <button
            onClick={launch}
            className="bg-primary text-primary-foreground font-semibold text-sm px-8 py-3.5 rounded-xl hover:brightness-110 transition-all active:scale-[0.97] inline-flex items-center gap-2"
          >
            launch app <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="font-bold text-xs">xitter<span className="text-primary font-mono">_</span></span>
          <div className="flex items-center gap-6 text-[11px] text-muted-foreground">
            <span>© 2026</span>
            <button onClick={() => navigate("/auth")} className="hover:text-foreground transition-colors">sign in</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
