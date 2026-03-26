import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";

/* ── Mock feed data ── */
const mockPosts = [
  { avatar: "S", handle: "satoshi", content: "bitcoin will hit $500k this cycle. not financial advice but also financial advice.", time: "2m", earned: "$18.50", price: "$2.40", tag: "rocket", tagColor: "text-emerald-500" },
  { avatar: "V", handle: "vitalik", content: "the future of social media is putting money where your mouth is. literally.", time: "5m", earned: "$7.20", price: "$1.00", tag: "flat", tagColor: "text-blue-500" },
  { avatar: "T", handle: "trader_joe", content: "just stole this post for $4.80. worth every penny.", time: "8m", earned: "$3.10", price: "$4.80", tag: "stolen", tagColor: "text-orange-500" },
  { avatar: "B", handle: "based_dev", content: "building on xitter rn. the feed is actually clean.", time: "12m", earned: "$2.30", price: "$0.50", tag: "dutch", tagColor: "text-teal-500" },
];

const MockPost = ({ avatar, handle, content, time, earned, price, tag, tagColor, delay }: typeof mockPosts[0] & { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="flex gap-3 px-4 py-3.5 border-b border-[#f0f0f0] last:border-0"
  >
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 uppercase">
      {avatar}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-semibold text-[#1a1a1a]">@{handle}</span>
        <span className="text-[#999]">{time}</span>
      </div>
      <p className="text-[#444] text-[13px] leading-relaxed mt-0.5">{content}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`text-[11px] font-mono font-medium ${tagColor}`}>{tag}</span>
        <span className="text-primary/60 text-[11px] font-mono">{earned} earned</span>
      </div>
    </div>
    <span className="text-[#1a1a1a] font-semibold text-sm shrink-0 font-mono">{price}</span>
  </motion.div>
);

/* ── Progress bar for pricing modes ── */
const PricingBar = ({ label, color, width, desc }: { label: string; color: string; width: string; desc: string }) => (
  <div className="flex items-center gap-3 text-[13px]">
    <span className={`font-mono font-medium w-14 shrink-0 ${color}`}>{label}</span>
    <div className="flex-1 h-2 bg-[#f0f2f5] rounded-full overflow-hidden">
      <div className={`h-full rounded-full`} style={{ width, background: color === "text-emerald-500" ? "#34d399" : color === "text-blue-500" ? "#60a5fa" : "#f97316" }} />
    </div>
    <span className="text-[#999] text-[12px] shrink-0">{desc}</span>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const launch = () => navigate(user ? "/feed" : "/auth");

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#1a1a1a] selection:bg-primary/20">
      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 inset-x-0 z-50 flex justify-center pt-5"
      >
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl border border-white/50 rounded-full px-5 py-2.5 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
          <span className="font-semibold text-[14px] tracking-tight mr-5">
            xitter<span className="text-primary font-mono">_</span>
          </span>
          {["feed", "explore", "trade", "docs"].map((link) => (
            <button
              key={link}
              onClick={() => navigate(user ? `/${link}` : "/auth")}
              className="text-[13px] text-[#999] hover:text-[#1a1a1a] px-3 py-1.5 rounded-lg transition-colors"
            >
              {link}
            </button>
          ))}
          <button
            onClick={launch}
            className="ml-3 bg-primary text-primary-foreground text-[13px] font-medium px-5 py-2 rounded-full hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            launch app <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 px-6 overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto max-w-7xl rounded-[28px] bg-white/70 backdrop-blur-md border border-white/50 overflow-hidden shadow-xl shadow-black/[0.06]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <p className="text-[12px] font-mono text-primary tracking-wide mb-5">
                built on solana · 0% fees
              </p>
              <h1 className="text-[clamp(30px,3.5vw,48px)] font-semibold tracking-[-0.03em] text-[#1a1a1a] leading-[1.1]">
                every word
                <br />
                has a price tag<span className="text-primary">.</span>
              </h1>
              <p className="text-[15px] text-[#999] leading-[1.7] mt-5 max-w-[380px]">
                posting costs money. replies pay the author. steal any post for 2x. 100% flows to users.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={launch}
                  className="group rounded-full bg-primary px-6 py-2.5 text-[14px] font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] flex items-center gap-2"
                >
                  launch app
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => navigate("/docs")}
                  className="text-[13px] text-[#999] hover:text-[#1a1a1a] transition-colors"
                >
                  api docs →
                </button>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-8 mt-10 pt-8 border-t border-[#f0f0f0]">
                {[
                  { value: "$0.10", label: "min post" },
                  { value: "2x", label: "steal price" },
                  { value: "<1s", label: "settlement" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[20px] font-semibold font-mono text-[#1a1a1a]">{s.value}</div>
                    <div className="text-[11px] text-[#bbb] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Feed Preview */}
            <div className="hidden lg:block border-l border-[#f0f0f0]">
              <div className="bg-white/50">
                {/* Feed chrome */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
                  <span className="font-semibold text-[13px]">xitter<span className="text-primary font-mono">_</span></span>
                  <div className="flex items-center gap-0.5 text-[11px]">
                    <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-medium">feed</span>
                    <span className="px-3 py-1 rounded-lg text-[#999]">explore</span>
                    <span className="px-3 py-1 rounded-lg text-[#999]">trade</span>
                  </div>
                  <span className="text-[#999] text-[11px] font-mono">$42.80 <span className="text-[#1a1a1a] font-medium">@you</span></span>
                </div>
                {mockPosts.map((post, i) => (
                  <MockPost key={i} {...post} delay={0.5 + i * 0.08} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── How It Works — Feature Cards ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-[clamp(28px,3vw,42px)] font-semibold tracking-[-0.03em]">
            how it works<span className="text-primary">.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Pricing modes */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] p-8 shadow-sm"
          >
            <span className="text-primary text-[11px] font-mono font-medium tracking-wider">pricing modes</span>
            <h3 className="text-[clamp(20px,2vw,28px)] font-semibold tracking-[-0.02em] mt-3 mb-6 leading-[1.15]">
              every post is
              <br />
              a micro-market<span className="text-primary">.</span>
            </h3>
            <div className="space-y-3">
              <PricingBar label="rocket" color="text-emerald-500" width="80%" desc="price increases with engagement" />
              <PricingBar label="flat" color="text-blue-500" width="50%" desc="price stays the same" />
              <PricingBar label="dutch" color="text-orange-500" width="30%" desc="price decreases over time" />
            </div>
          </motion.div>

          {/* Steal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] p-8 shadow-sm"
          >
            <span className="text-primary text-[11px] font-mono font-medium tracking-wider">steal</span>
            <h3 className="text-[clamp(20px,2vw,28px)] font-semibold tracking-[-0.02em] mt-3 mb-6 leading-[1.15]">
              take any post<span className="text-primary">.</span>
              <br />
              pay 2x.
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold font-mono">2x</div>
              <p className="text-[13px] text-[#999] leading-relaxed">original author earns, new owner controls the post</p>
            </div>
          </motion.div>

          {/* Replies */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
            className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] p-8 shadow-sm"
          >
            <span className="text-primary text-[11px] font-mono font-medium tracking-wider">replies</span>
            <h3 className="text-[clamp(20px,2vw,28px)] font-semibold tracking-[-0.02em] mt-3 mb-4 leading-[1.15]">
              every reply
              <br />
              pays the author<span className="text-primary">.</span>
            </h3>
            <p className="text-[13px] text-[#999] leading-relaxed">replying to a post costs money. 100% goes to the original poster.</p>
          </motion.div>

          {/* Versus */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] p-8 shadow-sm"
          >
            <span className="text-primary text-[11px] font-mono font-medium tracking-wider">versus</span>
            <h3 className="text-[clamp(20px,2vw,28px)] font-semibold tracking-[-0.02em] mt-3 mb-6 leading-[1.15]">
              battle with
              <br />
              real stakes<span className="text-primary">.</span>
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-primary/10 rounded-xl p-3 text-center">
                <div className="text-primary font-bold font-mono text-lg">$240</div>
                <div className="text-[11px] text-[#999] mt-1">take a</div>
              </div>
              <span className="text-[13px] font-semibold text-[#ccc]">vs</span>
              <div className="flex-1 bg-[#f0f2f5] rounded-xl p-3 text-center">
                <div className="text-[#1a1a1a] font-bold font-mono text-lg">$180</div>
                <div className="text-[11px] text-[#999] mt-1">take b</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Fees Banner ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] p-10 md:p-16 text-center shadow-sm"
        >
          <span className="text-primary text-[11px] font-mono font-medium tracking-wider">fees</span>
          <div className="text-[clamp(60px,8vw,100px)] font-bold font-mono text-primary mt-2 leading-none">0%</div>
          <p className="text-[18px] font-semibold mt-4 mb-1">100% of everything</p>
          <p className="text-[15px] text-[#999]">flows directly to users.</p>
        </motion.div>
      </section>

      {/* ── Steps ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-[clamp(28px,3vw,42px)] font-semibold tracking-[-0.03em]">
            how it works<span className="text-primary">.</span>
          </h2>
          <p className="text-[15px] text-[#999] mt-3">three steps. under a minute.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { num: "01", title: "sign up", desc: "create your account with email or wallet. a profile is set up instantly." },
            { num: "02", title: "deposit", desc: "connect your wallet or fund your account. that's your balance for everything." },
            { num: "03", title: "post & earn", desc: "write something worth paying for. earn from every reply, every engagement." },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] p-7 shadow-sm"
            >
              <span className="text-primary font-mono text-[13px] font-bold">{step.num}</span>
              <h3 className="text-[17px] font-semibold mt-3 mb-2">{step.title}</h3>
              <p className="text-[13px] text-[#999] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "100%", label: "goes to users" },
            { value: "$0.10", label: "min post price" },
            { value: "2×", label: "steal price" },
            { value: "<1s", label: "settlement" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] p-6 text-center shadow-sm"
            >
              <div className="text-[28px] font-bold font-mono text-primary">{s.value}</div>
              <div className="text-[12px] text-[#999] mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Comparison ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Everyone else */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] p-8 shadow-sm"
          >
            <h3 className="text-[18px] font-semibold mb-5 text-[#999]">everyone else</h3>
            <div className="space-y-3">
              {[
                "posts are free — spam everywhere",
                "bots farm engagement",
                "platform takes all the value",
                "engagement is vanity",
                "zero skin in the game",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[13px] text-[#999]">
                  <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* xitter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="bg-white/70 backdrop-blur-md border border-primary/20 rounded-[20px] p-8 shadow-sm"
          >
            <h3 className="text-[18px] font-semibold mb-5">xitter<span className="text-primary font-mono">_</span></h3>
            <div className="space-y-3">
              {[
                "every post costs real money",
                "real money = real engagement",
                "100% goes directly to users",
                "earnings are your reputation",
                "maximum skin in the game",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[13px] text-[#1a1a1a]">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <h2 className="text-[clamp(32px,4vw,56px)] font-semibold tracking-[-0.03em] mb-4">
            get started<span className="text-primary">.</span>
          </h2>
          <p className="text-[15px] text-[#999] mb-8 max-w-md mx-auto">
            join the social network where every word has a price tag. built on solana, settled on-chain.
          </p>
          <button
            onClick={launch}
            className="group rounded-full bg-primary px-8 py-3 text-[14px] font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] inline-flex items-center gap-2"
          >
            launch app
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#eee] py-5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2 text-[11px] text-[#bbb] font-mono">
          <span>solana</span><span>·</span>
          <span>usdc</span><span>·</span>
          <span>0% fees</span><span>·</span>
          <span>open api</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
