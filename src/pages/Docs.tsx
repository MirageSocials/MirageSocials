import { useState, useMemo, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageSquare, DollarSign, Shield, Zap, Users, BarChart3, Code, Rocket, ChevronRight, Search, Menu, X, Sun, Moon } from "lucide-react";
import logoImg from "@/assets/logo.png";
import CodeBlock from "@/components/docs/CodeBlock";
import ApiPlayground from "@/components/docs/ApiPlayground";
import HighlightText from "@/components/docs/HighlightText";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

/* ── Search highlight context ── */
const SearchContext = createContext("");
const useSearchHighlight = () => useContext(SearchContext);

const H = ({ children }: { children: string }) => {
  const q = useSearchHighlight();
  return <HighlightText text={children} query={q} />;
};

/* ── Sidebar structure ── */
const sidebarNav = [
  {
    group: "GETTING STARTED",
    items: [
      { id: "overview", label: "Overview" },
      { id: "quickstart", label: "Quickstart" },
      { id: "what-you-can-build", label: "What You Can Build" },
    ],
  },
  {
    group: "PLATFORM",
    items: [
      { id: "feed-posts", label: "Feed & Posts" },
      { id: "pricing-model", label: "Pricing Model" },
      { id: "steal-mechanic", label: "Steal Mechanic" },
      { id: "profiles", label: "Profiles & Identity" },
      { id: "messaging", label: "Direct Messages" },
    ],
  },
  {
    group: "SOLANA",
    items: [
      { id: "solana-integration", label: "Solana Integration" },
      { id: "on-chain", label: "On-Chain Verification" },
    ],
  },
  {
    group: "API REFERENCE",
    items: [
      { id: "api-overview", label: "Overview" },
      { id: "api-authentication", label: "Authentication" },
      { id: "api-posts", label: "Posts" },
      { id: "api-users", label: "Users" },
      { id: "api-feed", label: "Feed" },
      { id: "api-webhooks", label: "Webhooks" },
      { id: "api-errors", label: "Error Codes" },
    ],
  },
];

/* ── Searchable text map for content matching ── */
const sectionText: Record<string, string> = {
  overview: "Mirage is a social media platform where every word has a price tag. Built on Solana with 0% fees. Post costs money, replies pay the author, steal any post for 2x. 100% of value flows to users. Real-time feed, explore trending posts, direct messaging, trade integration.",
  quickstart: "Get started with Mirage in under a minute. Create an account with email. Connect your Solana wallet. Make your first post. Start earning from replies and engagement.",
  "what-you-can-build": "Content creators monetize posts. Curators discover and steal viral content. Traders integrate market analysis. Communities form around hashtags. Developers build with the Mirage API.",
  "feed-posts": "The Mirage feed displays posts in chronological order with real-time updates. Each post shows the author, content, price, earnings, and engagement metrics. Posts can include images and hashtags.",
  "pricing-model": "Posts start at a base price of $0.10. The price uses a Dutch auction model that decays over time. Replies cost a fraction of the parent post price and earnings flow to the original author.",
  "steal-mechanic": "Any post can be stolen by paying 2x the current price. The original author receives the full steal price. The stealer becomes the new owner and earns from future engagement. This creates a market for viral content.",
  profiles: "Each user has a profile with a display name, username, avatar, banner, and bio. Profiles track total earnings, post count, and follower/following counts. Username reservation requires a Solana transaction.",
  messaging: "Direct messages are end-to-end between users. Conversations are created automatically when you message someone for the first time. Messages support real-time delivery.",
  "solana-integration": "Mirage is built on Solana for fast, cheap transactions. User wallets are generated client-side using Ed25519 keypairs from @solana/web3.js. All payments settle on-chain in under 1 second.",
  "on-chain": "Every transaction on Mirage is verifiable on any Solana block explorer. Post payments, steals, and withdrawals are all recorded on-chain with cryptographic proof.",
  "api-overview": "The Mirage REST API lets you manage posts, users, feeds, and messaging programmatically. All endpoints return JSON with standard HTTP status codes. Base URL: https://api.mirage.io/v1",
  "api-authentication": "Authenticate using Bearer tokens. API keys start with xit_sk_ for secret keys and xit_pk_ for publishable keys. Keys support read-only, write, and full-access scopes.",
  "api-posts": "Create, read, update, and delete posts. Query post pricing, steal a post, list replies. Each post has content, price, author, earnings, and engagement data.",
  "api-users": "Look up user profiles, followers, following lists. Get user earnings history and post analytics.",
  "api-feed": "Fetch the main feed, trending posts, user-specific feeds, and hashtag feeds with pagination and filtering.",
  "api-webhooks": "Receive real-time notifications for post.created, post.stolen, user.followed, message.received events via webhook endpoints.",
  "api-errors": "Standard error format with error code and message. HTTP status codes: 200, 201, 400, 401, 403, 404, 429, 500.",
};

interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const Docs = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Filter sidebar AND content sections by search ── */
  const filteredNav = useMemo(() => {
    if (!searchQuery.trim()) return sidebarNav;
    const q = searchQuery.toLowerCase();
    return sidebarNav
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const labelMatch = item.label.toLowerCase().includes(q);
          const contentMatch = sectionText[item.id]?.toLowerCase().includes(q);
          return labelMatch || contentMatch;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  /* ── Section content ── */
  const sections: Record<string, DocSection> = {
    overview: {
      id: "overview",
      title: "Overview",
      content: (
        <div className="space-y-8">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Mirage is a social media platform where every word has a price tag. Built on Solana with 0% platform fees — posting costs money, replies pay the author, and anyone can steal any post for 2x the price. 100% of value flows to users.</H>
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: MessageSquare, title: "Priced Posts", desc: "Every post has a price. Posting costs money — creating a market for quality content and eliminating spam." },
              { icon: DollarSign, title: "Earn From Replies", desc: "When someone replies to your post, you earn. The more engagement your content gets, the more you make." },
              { icon: Zap, title: "Steal Mechanic", desc: "Any post can be stolen for 2x the current price. The original author gets paid and the stealer owns future earnings." },
              { icon: Rocket, title: "Instant Settlement", desc: "Built on Solana — all payments settle on-chain in under 1 second with near-zero gas fees." },
            ].map((card) => (
              <div key={card.title} className="bg-white/70 border border-[#e8eaed] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <card.icon className="h-5 w-5 text-primary mb-3" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-[#1a1a1a] mb-2"><H>{card.title}</H></h3>
                <p className="text-xs text-[#999] leading-relaxed"><H>{card.desc}</H></p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-4"><H>Key Features</H></h3>
            <div className="space-y-3">
              {[
                { bold: "Dutch auction pricing", rest: "Post prices decay over time, creating optimal discovery windows" },
                { bold: "Content marketplace", rest: "Every post is a tradeable asset with real monetary value" },
                { bold: "Zero platform fees", rest: "100% of all payments flow between users — Mirage takes nothing" },
                { bold: "Real-time feed", rest: "Live updates with engagement metrics, earnings tracking, and trending content" },
                { bold: "Solana-native", rest: "All transactions are on-chain and verifiable on any block explorer" },
              ].map((item) => (
                <div key={item.bold} className="flex items-start gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-[#999] leading-relaxed">
                    <span className="text-[#1a1a1a] font-medium"><H>{item.bold}</H></span> — <H>{item.rest}</H>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    quickstart: {
      id: "quickstart",
      title: "Quickstart",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Get started with Mirage in under a minute.</H>
          </p>
          {[
            { step: "01", title: "Create an Account", desc: "Sign up with your email. No credit card required." },
            { step: "02", title: "Connect Your Wallet", desc: "Link your Solana wallet or let Mirage generate one for you." },
            { step: "03", title: "Make Your First Post", desc: "Write something worth reading. Set a price and publish." },
            { step: "04", title: "Start Earning", desc: "Get paid when people reply to your posts or steal them." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 items-start">
              <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 rounded-xl px-2.5 py-1">{s.step}</span>
              <div>
                <h4 className="text-sm font-semibold text-[#1a1a1a] mb-1"><H>{s.title}</H></h4>
                <p className="text-xs text-[#999] leading-relaxed"><H>{s.desc}</H></p>
              </div>
            </div>
          ))}
          <CodeBlock code={`$ mirage init\n◉ Mirage v2.0.0\nConnecting wallet...\n✓ Wallet: 7xKXt...9fQm (Solana)\n✓ Account created. Welcome to Mirage!`} language="bash" />
        </div>
      ),
    },
    "what-you-can-build": {
      id: "what-you-can-build",
      title: "What You Can Build",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Mirage supports a variety of use cases for creators, curators, and developers.</H>
          </p>
          <div className="space-y-4">
            {[
              { title: "Content Monetization", desc: "Creators earn directly from engagement — no ads, no middlemen. Every reply and steal puts money in your pocket." },
              { title: "Content Curation", desc: "Discover underpriced posts and steal them before they go viral. Build a portfolio of high-earning content." },
              { title: "Trading Integration", desc: "Share market analysis and trade setups. Your trading calls become priced assets with real monetary value." },
              { title: "Community Building", desc: "Form communities around hashtags. Top contributors earn the most from engagement." },
              { title: "API Integrations", desc: "Build bots, dashboards, and tools using the Mirage API. Automate posting and content discovery." },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-primary/30 pl-4">
                <h4 className="text-sm font-semibold text-[#1a1a1a] mb-1"><H>{item.title}</H></h4>
                <p className="text-xs text-[#999] leading-relaxed"><H>{item.desc}</H></p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "feed-posts": {
      id: "feed-posts",
      title: "Feed & Posts",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>The Mirage feed displays posts in real-time with live price updates, earnings tracking, and engagement metrics.</H>
          </p>
          <CodeBlock code={`// Post structure\nPost {\n  id: string\n  content: string\n  author: User\n  price: number        // current price (Dutch auction)\n  base_price: number   // starting price\n  earnings: number     // total earned from replies & steals\n  image_url?: string\n  parent_id?: string   // if reply\n  stolen_from?: string // if stolen\n  created_at: timestamp\n}`} language="typescript" />
          <div className="space-y-3">
            {[
              { bold: "Chronological feed", rest: "Posts appear newest-first with real-time updates via WebSockets" },
              { bold: "Engagement metrics", rest: "Each post shows likes, replies, reposts, and total earnings" },
              { bold: "Image support", rest: "Posts can include images uploaded to Mirage storage" },
              { bold: "Hashtags", rest: "Tag posts with hashtags to join trending conversations" },
              { bold: "Thread support", rest: "Reply to posts to create threaded conversations" },
            ].map((item) => (
              <div key={item.bold} className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-[#999] leading-relaxed">
                  <span className="text-[#1a1a1a] font-medium"><H>{item.bold}</H></span> — <H>{item.rest}</H>
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "pricing-model": {
      id: "pricing-model",
      title: "Pricing Model",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Every post on Mirage uses a Dutch auction pricing model. Posts start at a base price and decay over time, creating optimal windows for discovery and engagement.</H>
          </p>
          <div className="space-y-4">
            {[
              { bold: "Base price", rest: "Minimum $0.10 per post. Authors can set higher base prices for premium content." },
              { bold: "Price decay", rest: "The price decreases over time following a logarithmic curve, making older posts cheaper to interact with." },
              { bold: "Reply earnings", rest: "Replies cost a fraction of the current post price. The earnings flow directly to the parent post author." },
              { bold: "Steal price", rest: "Always 2x the current post price. The original author receives the full amount." },
            ].map((item) => (
              <div key={item.bold} className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-[#999] leading-relaxed">
                  <span className="text-[#1a1a1a] font-medium"><H>{item.bold}</H></span> — <H>{item.rest}</H>
                </p>
              </div>
            ))}
          </div>
          <CodeBlock code={`// Price calculation\nconst currentPrice = basePrice * Math.max(0.1, 1 - Math.log(ageMinutes + 1) * 0.15)\nconst stealPrice = currentPrice * 2\nconst replyCost = currentPrice * 0.25`} language="typescript" />
        </div>
      ),
    },
    "steal-mechanic": {
      id: "steal-mechanic",
      title: "Steal Mechanic",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>The steal mechanic is Mirage's signature feature. Any post can be stolen by paying 2x the current price. This creates a speculative market for viral content.</H>
          </p>
          <div className="space-y-4">
            <div className="bg-white/70 border border-[#e8eaed] rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3"><H>How Stealing Works</H></h4>
              <div className="space-y-2 text-xs text-[#666]">
                <p><H>1. You see a post you think will go viral</H></p>
                <p><H>2. Click "Steal" and pay 2x the current price</H></p>
                <p><H>3. The original author receives the full payment</H></p>
                <p><H>4. You become the new owner and earn from future engagement</H></p>
                <p><H>5. Someone else can steal it from you for 2x the new price</H></p>
              </div>
            </div>
          </div>
          <CodeBlock code={`// Steal transaction\n{\n  "type": "steal",\n  "post_id": "post_01X...",\n  "from": "@satoshi",\n  "to": "@you",\n  "price_paid": 4.80,\n  "new_price": 9.60,\n  "tx_signature": "3xK9f..."\n}`} language="json" />
        </div>
      ),
    },
    profiles: {
      id: "profiles",
      title: "Profiles & Identity",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Each Mirage user has a profile with a display name, unique username, avatar, banner image, and bio. Username reservation requires a Solana transaction for on-chain verification.</H>
          </p>
          <div className="space-y-3">
            {[
              { bold: "Username", rest: "Unique handle prefixed with @. Reserved on-chain via Solana transaction." },
              { bold: "Display name", rest: "Customizable name shown alongside your username." },
              { bold: "Avatar & Banner", rest: "Upload custom images for your profile picture and banner." },
              { bold: "Bio", rest: "Short description visible on your profile page." },
              { bold: "Earnings tracker", rest: "Total earnings from posts, replies, and steals displayed on profile." },
              { bold: "Follower system", rest: "Follow other users to see their posts in your feed." },
            ].map((item) => (
              <div key={item.bold} className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-[#999] leading-relaxed">
                  <span className="text-[#1a1a1a] font-medium"><H>{item.bold}</H></span> — <H>{item.rest}</H>
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    messaging: {
      id: "messaging",
      title: "Direct Messages",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Mirage supports real-time direct messaging between users. Conversations are created automatically when you message someone for the first time.</H>
          </p>
          <div className="space-y-3">
            {[
              { bold: "Real-time delivery", rest: "Messages appear instantly using WebSocket connections." },
              { bold: "Read receipts", rest: "See when your messages have been read by the recipient." },
              { bold: "Conversation list", rest: "All conversations displayed in a sidebar with the latest message preview." },
            ].map((item) => (
              <div key={item.bold} className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-[#999] leading-relaxed">
                  <span className="text-[#1a1a1a] font-medium"><H>{item.bold}</H></span> — <H>{item.rest}</H>
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "solana-integration": {
      id: "solana-integration",
      title: "Solana Integration",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Mirage is built natively on Solana using @solana/web3.js. All payments and transactions settle on-chain with sub-second finality.</H>
          </p>
          <CodeBlock code={`// Wallet generation\nimport { Keypair } from '@solana/web3.js'\n\nconst keypair = Keypair.generate()\nconst address = keypair.publicKey.toBase58()\n\n// Each user gets a unique keypair on signup`} language="typescript" />
        </div>
      ),
    },
    "on-chain": {
      id: "on-chain",
      title: "On-Chain Verification",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Every transaction on Mirage is verifiable on any Solana block explorer. Post payments, steals, and username reservations are all recorded on-chain.</H>
          </p>
          <CodeBlock code={`Verify on Solscan:\nhttps://solscan.io/tx/<transaction_signature>`} language="bash" />
          <p className="text-xs text-[#999] leading-relaxed">
            <H>All transactions use cryptographically secure Ed25519 signatures. No private keys leave your browser.</H>
          </p>
        </div>
      ),
    },
    "api-overview": {
      id: "api-overview",
      title: "API Overview",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>The Mirage REST API lets you manage posts, users, feeds, and messaging programmatically. All endpoints return JSON and use standard HTTP status codes.</H>
          </p>
          <CodeBlock code={`// Base URL\nhttps://api.mirage.io/v1\n\n// Content-Type\napplication/json`} language="typescript" />
          <div>
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-3"><H>Rate Limits</H></h3>
            <div className="space-y-2 text-xs text-[#999]">
              <p><span className="text-[#1a1a1a] font-medium">Free tier</span> — <H>60 requests / minute</H></p>
              <p><span className="text-[#1a1a1a] font-medium">Pro tier</span> — <H>300 requests / minute</H></p>
              <p><span className="text-[#1a1a1a] font-medium">Enterprise</span> — <H>Custom limits</H></p>
            </div>
          </div>
        </div>
      ),
    },
    "api-authentication": {
      id: "api-authentication",
      title: "Authentication",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Authenticate using a Bearer token in the Authorization header. Generate API keys from your settings page.</H>
          </p>
          <CodeBlock code={`curl https://api.mirage.io/v1/posts \\\n  -H "Authorization: Bearer xit_sk_..."`} language="bash" />
          <div className="space-y-3">
            {[
              { bold: "API Key Prefix", rest: "All keys start with xit_sk_ for secret keys and xit_pk_ for publishable keys." },
              { bold: "Scopes", rest: "Keys can be scoped to read-only, write, or full-access permissions." },
              { bold: "Rotation", rest: "Rotate keys instantly from settings. Old keys are revoked immediately." },
            ].map((item) => (
              <div key={item.bold} className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-[#999] leading-relaxed">
                  <span className="text-[#1a1a1a] font-medium"><H>{item.bold}</H></span> — <H>{item.rest}</H>
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "api-posts": {
      id: "api-posts",
      title: "Posts API",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Create, read, and interact with posts on Mirage.</H>
          </p>
          <ApiPlayground method="GET" path="/v1/posts" desc="List posts with pagination and filters." sampleResponse={`[\n  {\n    "id": "post_01X...",\n    "content": "every word has a price tag.",\n    "author": "@satoshi",\n    "price": 2.40,\n    "earnings": 18.50,\n    "replies": 12\n  }\n]`} />
          <ApiPlayground method="POST" path="/v1/posts" desc="Create a new post with content and base price." sampleBody={`{\n  "content": "building the future of social media",\n  "base_price": 0.50,\n  "image_url": null\n}`} sampleResponse={`{\n  "id": "post_02K...",\n  "content": "building the future of social media",\n  "price": 0.50,\n  "author": "@you",\n  "tx_signature": "3xK9f..."\n}`} />
          <ApiPlayground method="GET" path="/v1/posts/:id" desc="Get a single post with full details." sampleResponse={`{\n  "id": "post_01X...",\n  "content": "every word has a price tag.",\n  "author": "@satoshi",\n  "price": 2.40,\n  "earnings": 18.50,\n  "replies": 12,\n  "created_at": "2026-03-26T14:00:00Z"\n}`} />
          <ApiPlayground method="POST" path="/v1/posts/:id/steal" desc="Steal a post by paying 2x the current price." sampleResponse={`{\n  "id": "post_01X...",\n  "new_owner": "@you",\n  "price_paid": 4.80,\n  "new_price": 9.60,\n  "tx_signature": "5yM2a..."\n}`} />
          <ApiPlayground method="POST" path="/v1/posts/:id/reply" desc="Reply to a post (costs a fraction of the post price)." sampleBody={`{\n  "content": "this is so true"\n}`} sampleResponse={`{\n  "id": "post_03R...",\n  "parent_id": "post_01X...",\n  "content": "this is so true",\n  "cost": 0.60\n}`} />
        </div>
      ),
    },
    "api-users": {
      id: "api-users",
      title: "Users API",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Look up user profiles, followers, and earnings.</H>
          </p>
          <ApiPlayground method="GET" path="/v1/users/:username" desc="Get a user profile by username." sampleResponse={`{\n  "username": "satoshi",\n  "display_name": "Satoshi",\n  "bio": "digital gold maximalist",\n  "total_earnings": 1420.50,\n  "post_count": 89,\n  "followers": 2341\n}`} />
          <ApiPlayground method="GET" path="/v1/users/:username/posts" desc="List posts by a specific user." sampleResponse={`[\n  {\n    "id": "post_01X...",\n    "content": "bitcoin will hit $500k",\n    "price": 2.40,\n    "earnings": 18.50\n  }\n]`} />
          <ApiPlayground method="POST" path="/v1/users/:username/follow" desc="Follow a user." sampleResponse={`{\n  "following": true,\n  "user": "satoshi"\n}`} />
          <ApiPlayground method="DELETE" path="/v1/users/:username/follow" desc="Unfollow a user." sampleResponse={`{\n  "following": false,\n  "user": "satoshi"\n}`} />
        </div>
      ),
    },
    "api-feed": {
      id: "api-feed",
      title: "Feed API",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Fetch feeds with real-time data, trending posts, and hashtag filtering.</H>
          </p>
          <ApiPlayground method="GET" path="/v1/feed" desc="Get the main feed for the authenticated user." sampleResponse={`[\n  {\n    "id": "post_01X...",\n    "content": "bitcoin will hit $500k",\n    "author": "@satoshi",\n    "price": 2.40,\n    "earnings": 18.50\n  }\n]`} />
          <ApiPlayground method="GET" path="/v1/feed/trending" desc="Get trending posts sorted by engagement." sampleResponse={`[\n  {\n    "id": "post_05T...",\n    "content": "solana is the future",\n    "author": "@sol_maxi",\n    "price": 8.20,\n    "steal_count": 4\n  }\n]`} />
          <ApiPlayground method="GET" path="/v1/feed/hashtag/:tag" desc="Get posts filtered by hashtag." sampleResponse={`[\n  {\n    "id": "post_07H...",\n    "content": "#crypto is having a moment",\n    "author": "@trader_joe",\n    "price": 1.20\n  }\n]`} />
          <div>
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-3"><H>Query Parameters</H></h3>
            <div className="space-y-2 text-xs text-[#999]">
              <p><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">limit</code> — <H>Number of results (default 50, max 200)</H></p>
              <p><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">offset</code> — <H>Pagination offset</H></p>
              <p><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">sort</code> — <H>Sort by: recent, trending, price</H></p>
            </div>
          </div>
        </div>
      ),
    },
    "api-webhooks": {
      id: "api-webhooks",
      title: "Webhooks",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>Receive real-time notifications when events occur on Mirage.</H>
          </p>
          <ApiPlayground method="POST" path="/v1/webhooks" desc="Register a new webhook endpoint." sampleBody={`{\n  "url": "https://your-app.com/webhook",\n  "events": ["post.created", "post.stolen"]\n}`} sampleResponse={`{\n  "id": "wh_01X...",\n  "url": "https://your-app.com/webhook",\n  "events": ["post.created", "post.stolen"],\n  "active": true\n}`} />
          <ApiPlayground method="GET" path="/v1/webhooks" desc="List all registered webhooks." sampleResponse={`[\n  {\n    "id": "wh_01X...",\n    "url": "https://your-app.com/webhook",\n    "events": ["post.created"],\n    "active": true\n  }\n]`} />
          <ApiPlayground method="DELETE" path="/v1/webhooks/:id" desc="Remove a webhook." sampleResponse={`{\n  "deleted": true\n}`} />
          <div>
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-3"><H>Event Types</H></h3>
            <div className="space-y-2 text-xs text-[#999] font-mono">
              <p><span className="text-primary">post.created</span> — <H>A new post was published</H></p>
              <p><span className="text-primary">post.stolen</span> — <H>A post was stolen by another user</H></p>
              <p><span className="text-primary">post.replied</span> — <H>Someone replied to a post</H></p>
              <p><span className="text-primary">user.followed</span> — <H>A user was followed</H></p>
              <p><span className="text-primary">message.received</span> — <H>A direct message was received</H></p>
            </div>
          </div>
          <CodeBlock code={`{\n  "event": "post.stolen",\n  "timestamp": "2026-03-26T14:30:00Z",\n  "data": {\n    "post_id": "post_01X...",\n    "from": "@satoshi",\n    "to": "@you",\n    "price": 4.80\n  }\n}`} language="json" />
        </div>
      ),
    },
    "api-errors": {
      id: "api-errors",
      title: "Error Codes",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-[#666] leading-relaxed">
            <H>All errors follow a consistent format with an error code and human-readable message.</H>
          </p>
          <CodeBlock code={`{\n  "error": {\n    "code": "insufficient_balance",\n    "message": "Not enough funds to complete this action",\n    "status": 400\n  }\n}`} language="json" />
          <div>
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-3"><H>HTTP Status Codes</H></h3>
            <div className="space-y-2 text-xs text-[#999]">
              <p><span className="text-[#1a1a1a] font-medium font-mono">200</span> — <H>Success</H></p>
              <p><span className="text-[#1a1a1a] font-medium font-mono">201</span> — <H>Created</H></p>
              <p><span className="text-[#1a1a1a] font-medium font-mono">400</span> — <H>Bad request / validation error</H></p>
              <p><span className="text-[#1a1a1a] font-medium font-mono">401</span> — <H>Unauthorized (missing or invalid API key)</H></p>
              <p><span className="text-[#1a1a1a] font-medium font-mono">403</span> — <H>Forbidden (insufficient permissions)</H></p>
              <p><span className="text-[#1a1a1a] font-medium font-mono">404</span> — <H>Resource not found</H></p>
              <p><span className="text-[#1a1a1a] font-medium font-mono">429</span> — <H>Rate limited</H></p>
              <p><span className="text-[#1a1a1a] font-medium font-mono">500</span> — <H>Internal server error</H></p>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-3"><H>Common Error Codes</H></h3>
            <div className="space-y-2 text-xs text-[#999] font-mono">
              <p><span className="text-primary">insufficient_balance</span> — <H>Not enough funds for the requested action</H></p>
              <p><span className="text-primary">post_not_found</span> — <H>The specified post does not exist</H></p>
              <p><span className="text-primary">already_stolen</span> — <H>Post was stolen by another user during your request</H></p>
              <p><span className="text-primary">username_taken</span> — <H>The requested username is already reserved</H></p>
              <p><span className="text-primary">rate_limited</span> — <H>Too many requests, retry after cooldown</H></p>
              <p><span className="text-primary">invalid_content</span> — <H>Post content violates guidelines</H></p>
            </div>
          </div>
        </div>
      ),
    },
  };

  const currentSection = sections[activeSection] || sections.overview;

  const sidebarContent = (
    <>
      <div className="p-3 border-b border-[#e8eaed]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#bbb]" />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-mono bg-[#f5f6f8] border border-[#e8eaed] rounded-xl pl-8 pr-3 py-2 text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      <nav className="p-3 space-y-5 flex-1 overflow-y-auto">
        {filteredNav.map((group) => (
          <div key={group.group}>
            <div className="text-[9px] tracking-widest uppercase text-[#bbb] font-mono mb-2 px-2">
              {group.group}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isContentMatch = searchQuery.trim() && sectionText[item.id]?.toLowerCase().includes(searchQuery.toLowerCase()) && !item.label.toLowerCase().includes(searchQuery.toLowerCase());
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSection(item.id)}
                    className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "text-[#1a1a1a] bg-primary/10 font-medium"
                        : "text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f6f8]"
                    }`}
                  >
                    {item.label}
                    {isContentMatch && (
                      <span className="ml-1.5 text-[9px] text-primary font-mono">match</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {filteredNav.length === 0 && (
          <p className="text-[10px] text-[#bbb] text-center py-4 font-mono">No results found</p>
        )}
      </nav>

      <div className="p-4 border-t border-[#e8eaed]">
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#bbb] hover:text-[#1a1a1a] transition-colors font-mono">
          Twitter ↗
        </a>
      </div>
    </>
  );

  return (
    <SearchContext.Provider value={searchQuery}>
      <div className="min-h-screen bg-[#FAFBFD] flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-56 border-r border-[#e8eaed] bg-white/70 backdrop-blur-xl fixed top-0 left-0 h-screen flex-col">
          <div className="p-4 border-b border-[#e8eaed] flex items-center justify-between">
            <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs font-mono text-[#1a1a1a]">
              <img src={logoImg} alt="Mirage" className="w-5 h-5 rounded" />
              <span className="font-bold">mirage</span>
              <span className="text-primary glow-text">_</span>
              <span className="text-[#999] font-normal ml-1">docs</span>
            </button>
            <button onClick={toggleTheme} className="p-1.5 rounded-lg text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f6f8] transition-colors" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
          {sidebarContent}
        </aside>

        {/* Mobile header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 bg-white/80 backdrop-blur-xl border-b border-[#e8eaed] flex items-center justify-between px-4 shadow-sm">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-xs font-mono text-[#1a1a1a]">
            <span className="font-bold">mirage</span>
            <span className="text-primary glow-text">_</span>
            <span className="text-[#999] font-normal ml-1">docs</span>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-1.5 text-[#999] hover:text-[#1a1a1a] transition-colors" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 text-[#999] hover:text-[#1a1a1a] transition-colors">
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="md:hidden fixed top-12 left-0 bottom-0 z-50 w-64 bg-white border-r border-[#e8eaed] flex flex-col shadow-xl"
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 md:ml-56 pt-12 md:pt-0">
          <div className="max-w-2xl mx-auto px-6 md:px-8 py-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-xs text-[#999] hover:text-[#1a1a1a] transition-colors mb-8"
            >
              <ArrowRight className="h-3 w-3 rotate-180" /> Back to Home
            </button>

            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold font-display text-[#1a1a1a] mb-6">{currentSection.title}</h1>
              {currentSection.content}
            </motion.div>
          </div>
        </main>
      </div>
    </SearchContext.Provider>
  );
};

export default Docs;
