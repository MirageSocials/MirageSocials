import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, X, Zap, Shield, Users, DollarSign, MessageSquare, TrendingUp, Award, Globe } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const features = [
  { icon: Zap, title: "Instant Posts", desc: "Create posts that become micro-markets. Every word carries real value on-chain." },
  { icon: Shield, title: "Verified Actions", desc: "Every like, reply, and steal is settled on Solana. Transparent and immutable." },
  { icon: DollarSign, title: "Earn From Content", desc: "100% of engagement revenue flows to creators. No middlemen, no fees." },
  { icon: MessageSquare, title: "Paid Replies", desc: "Replies cost money. Authors earn from every conversation. Quality over noise." },
  { icon: TrendingUp, title: "Dynamic Pricing", desc: "Posts use rocket, flat, or dutch pricing models. Markets decide the value." },
  { icon: Award, title: "Steal Mechanic", desc: "Take any post for 2x the price. Original author profits, new owner controls." },
];

const stats = [
  { value: "0%", label: "Platform fees" },
  { value: "<1s", label: "Settlement time" },
  { value: "100%", label: "To creators" },
  { value: "24/7", label: "On-chain" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const launch = () => navigate(user ? "/feed" : "/auth");

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4"
      >
        <div className="flex items-center gap-1 bg-card/80 backdrop-blur-xl border border-border rounded-full px-5 py-2.5 shadow-lg">
          <span className="font-semibold text-[14px] tracking-tight mr-5 text-foreground">
            xitter<span className="text-primary font-mono">_</span>
          </span>
          {["feed", "explore", "docs"].map((link) => (
            <button
              key={link}
              onClick={() => navigate(user ? `/${link}` : "/auth")}
              className="text-[13px] text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
            >
              {link}
            </button>
          ))}
          <button
            onClick={launch}
            className="ml-3 bg-primary text-primary-foreground text-[13px] font-medium px-5 py-2 rounded-full hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-32 lg:pt-44 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[12px] font-mono text-primary">Built on Solana · Live</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-[clamp(36px,5vw,72px)] font-bold tracking-[-0.04em] leading-[1.05] mb-6"
          >
            The social network where
            <br />
            <span className="text-primary">every word has value</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Post, earn, and trade attention. Every interaction is backed by real money, settled instantly on Solana. No fees, no ads, no algorithms.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <button
              onClick={launch}
              className="group rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              Launch App
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate("/docs")}
              className="rounded-full border border-border px-8 py-3.5 text-[15px] font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Read Docs
            </button>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center py-4"
            >
              <div className="text-2xl md:text-3xl font-bold font-mono text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">How it works</span>
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-[-0.03em] mt-3">
            Three steps to start earning
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Get set up in under a minute and start earning from your content.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            { num: "01", title: "Create Account", desc: "Sign up with email. Your profile and wallet are set up instantly, ready to go.", icon: Users },
            { num: "02", title: "Fund & Connect", desc: "Connect your Solana wallet or deposit directly. Your balance powers all interactions.", icon: DollarSign },
            { num: "03", title: "Post & Earn", desc: "Write something worth paying for. Every reply and engagement earns you real money.", icon: TrendingUp },
          ].map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-primary font-mono text-sm font-bold">{step.num}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Features</span>
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-[-0.03em] mt-3">
            Built for real engagement
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Comparison */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            <h3 className="text-lg font-semibold mb-5 text-muted-foreground">Traditional Social</h3>
            <div className="space-y-3">
              {[
                "Posts are free — spam everywhere",
                "Bots farm engagement",
                "Platform takes all the value",
                "Engagement is vanity metrics",
                "Zero skin in the game",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="bg-card border-2 border-primary/30 rounded-2xl p-8 shadow-lg shadow-primary/5"
          >
            <h3 className="text-lg font-semibold mb-5 text-foreground">
              xitter<span className="text-primary font-mono">_</span>
            </h3>
            <div className="space-y-3">
              {[
                "Every post costs real money",
                "Real money = real engagement",
                "100% goes directly to users",
                "Earnings are your reputation",
                "Maximum skin in the game",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="bg-card border border-border rounded-3xl p-12 md:p-16 text-center"
        >
          <Globe className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-[-0.03em] mb-4">
            Ready to join?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join the social network where every word has a price tag. Built on Solana, settled on-chain, zero fees.
          </p>
          <button
            onClick={launch}
            className="group rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] inline-flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-border py-6"
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-mono">
            xitter<span className="text-primary">_</span>
          </span>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <span>solana</span>
            <span className="text-border">·</span>
            <span>usdc</span>
            <span className="text-border">·</span>
            <span>0% fees</span>
            <span className="text-border">·</span>
            <a href="/docs" className="hover:text-foreground transition-colors">docs</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
