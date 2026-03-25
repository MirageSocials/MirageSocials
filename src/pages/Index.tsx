import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

const mockPosts = [
  {
    avatar: "S",
    avatarColor: "bg-blue-500",
    handle: "@satoshi",
    time: "2m",
    content: "bitcoin will hit $500k this cycle. not financial advice but also financial advice.",
    tag: "rocket",
    tagColor: "text-emerald-500",
    earned: "$18.50 earned",
    price: "$2.40",
  },
  {
    avatar: "V",
    avatarColor: "bg-violet-500",
    handle: "@vitalik",
    time: "5m",
    content: "the future of social media is putting money where your mouth is. literally.",
    tag: "flat",
    tagColor: "text-blue-500",
    earned: "$7.20 earned",
    price: "$1.00",
  },
  {
    avatar: "T",
    avatarColor: "bg-orange-500",
    handle: "@trader_joe",
    time: "8m",
    content: "just stole this post for $4.80. worth every penny.",
    tag: "stolen",
    tagColor: "text-emerald-500",
    earned: "$3.10 earned",
    price: "$4.80",
  },
  {
    avatar: "B",
    avatarColor: "bg-pink-500",
    handle: "@based_dev",
    time: "12m",
    content: "building on xitter rn. the feed is actually addicting.",
    tag: "dutch",
    tagColor: "text-emerald-500",
    earned: "$2.30 earned",
    price: "$0.50",
  },
];

const steps = [
  {
    num: "01",
    title: "sign up",
    desc: "create your account. a profile is set up automatically.",
  },
  {
    num: "02",
    title: "post & engage",
    desc: "share your thoughts, use #hashtags, reply to threads, repost what you love.",
  },
  {
    num: "03",
    title: "build your network",
    desc: "follow traders, get notifications, DM anyone. grow your reach.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  }),
};

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#1a1a2e] overflow-x-hidden">
      {/* ── Navbar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 flex items-center justify-center py-4 px-4"
      >
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl border border-[#e5e7eb] rounded-full px-4 sm:px-6 py-2.5 shadow-[0_2px_20px_rgba(0,0,0,0.06)] max-w-full overflow-x-auto">
          <span className="font-black text-lg tracking-tight mr-3 sm:mr-6 shrink-0">𝕏itter<span className="text-[hsl(var(--primary))]">_</span></span>
          <div className="hidden sm:flex items-center gap-1">
            {["feed", "explore", "messages"].map((link) => (
              <button
                key={link}
                onClick={() => navigate(user ? `/${link}` : "/auth")}
                className="text-sm text-[#6b7280] hover:text-[#1a1a2e] px-3 py-1.5 rounded-full transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block ml-2 p-1.5 text-[#6b7280] hover:text-[#1a1a2e] transition-colors"
          >
            <X className="h-4 w-4" />
          </a>
          <button
            onClick={() => navigate(user ? "/feed" : "/auth")}
            className="ml-2 sm:ml-3 bg-[hsl(var(--primary))] text-white text-sm font-semibold px-4 sm:px-5 py-2 rounded-full hover:opacity-90 transition-colors flex items-center gap-1.5 shrink-0"
          >
            launch app <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="pt-8">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-sm text-[#6b7280] tracking-wide mb-6"
            >
              built on solana · social trading
            </motion.p>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-[68px] font-black leading-[1.05] tracking-tight mb-6"
            >
              every trade<br />
              tells a story<span className="text-[hsl(var(--primary))]">.</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-[#6b7280] text-base leading-relaxed max-w-md mb-10"
            >
              share your trades. follow top traders. discuss in threads. the social layer for on-chain trading.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-4 mb-12"
            >
              <button
                onClick={() => navigate(user ? "/feed" : "/auth")}
                className="bg-[hsl(204,88%,53%)] text-white font-semibold text-sm px-7 py-3 rounded-full hover:bg-[hsl(204,88%,46%)] transition-colors flex items-center gap-2"
              >
                launch app <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="text-sm text-[#6b7280] hover:text-[#1a1a2e] transition-colors flex items-center gap-1"
              >
                api docs <span className="ml-0.5">→</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-10"
            >
              {[
                { value: "∞", label: "free posts" },
                { value: "#tags", label: "trending" },
                { value: "<1s", label: "realtime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                  <div className="text-xs text-[#9ca3af] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Feed preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            {/* Feed header tabs */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
              <div className="flex items-center gap-1">
                <span className="font-black text-sm">𝕏itter<span className="text-[hsl(204,88%,53%)]">_</span></span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {["feed", "explore", "trending"].map((tab, i) => (
                  <span
                    key={tab}
                    className={`px-3 py-1 rounded-full ${
                      i === 0
                        ? "bg-[hsl(204,88%,53%)] text-white font-medium"
                        : "text-[#9ca3af] hover:text-[#6b7280]"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <span className="text-xs text-[#9ca3af]">@you</span>
            </div>

            {/* Posts */}
            <div className="divide-y divide-[#f5f5f5]">
              {mockPosts.map((post, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-[#fafafa] transition-colors">
                  <div
                    className={`w-8 h-8 rounded-full ${post.avatarColor} text-white flex items-center justify-center text-xs font-bold shrink-0`}
                  >
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-semibold text-[#1a1a2e]">{post.handle}</span>
                      <span className="text-[#c4c4c4]">{post.time}</span>
                    </div>
                    <p className="text-sm text-[#374151] leading-relaxed mb-1.5">{post.content}</p>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className={`font-medium ${post.tagColor}`}>{post.tag}</span>
                      <span className="text-emerald-500 font-medium">{post.earned}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#1a1a2e] shrink-0">{post.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-black tracking-tight text-center mb-4"
        >
          how it works<span className="text-[hsl(204,88%,53%)]">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-[#6b7280] mb-16"
        >
          three steps. under a minute.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-white rounded-2xl border border-[#e5e7eb] p-8 hover:shadow-lg transition-shadow"
            >
              <span className="text-[hsl(204,88%,53%)] font-mono text-sm font-bold">{step.num}</span>
              <h3 className="text-xl font-black mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              label: "threads",
              title: "full conversations.\nwith context.",
              desc: "every reply builds a thread. see the full conversation in one place.",
            },
            {
              label: "hashtags",
              title: "discover what's\ntrending.",
              desc: "use #hashtags to categorize posts. explore trending topics in real-time.",
            },
            {
              label: "reposts",
              title: "amplify voices.\nshare ideas.",
              desc: "repost or quote-post to share content with your followers.",
            },
            {
              label: "realtime",
              title: "instant updates.\nzero refresh.",
              desc: "notifications, messages, and feed updates arrive the moment they happen.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-white rounded-2xl border border-[#e5e7eb] p-8 hover:shadow-lg transition-shadow"
            >
              <span className="text-[hsl(204,88%,53%)] font-mono text-xs font-bold tracking-wider">{feature.label}</span>
              <h3 className="text-2xl font-black mt-3 mb-3 whitespace-pre-line leading-tight">
                {feature.title.split("\n")[0]}<br />
                {feature.title.split("\n")[1]}<span className="text-[hsl(204,88%,53%)]">.</span>
              </h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">{feature.desc}</p>
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
          className="bg-[#1a1a2e] rounded-2xl p-12 md:p-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            start posting<span className="text-[hsl(204,88%,53%)]">.</span>
          </h2>
          <p className="text-[#9ca3af] mb-8 max-w-md mx-auto">
            join the conversation. share your trades, follow the best, and build your network.
          </p>
          <button
            onClick={() => navigate(user ? "/feed" : "/auth")}
            className="bg-[hsl(204,88%,53%)] text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-[hsl(204,88%,46%)] transition-colors inline-flex items-center gap-2"
          >
            launch app <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#e5e7eb] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-black text-sm">𝕏itter<span className="text-[hsl(204,88%,53%)]">_</span></span>
          <div className="flex items-center gap-6 text-xs text-[#9ca3af]">
            <span>© 2026 Xitter</span>
            <button onClick={() => navigate("/auth")} className="hover:text-[#1a1a2e] transition-colors">Sign in</button>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a2e] transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
