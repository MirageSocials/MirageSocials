# Mirage

**Mirage** is a social media platform where every word has a price tag. Built on Solana with 0% platform fees — posting costs money, replies pay the author, and anyone can steal any post for 2x the price. 100% of value flows to users.

**Live:** [MirageSocials.fun](https://MirageSocials.fun)

---

## ✨ Core Concepts

### Priced Posts
Every post has a price. Posting costs money — creating a market for quality content and eliminating spam.

### Earn From Replies
When someone replies to your post, you earn. The more engagement your content gets, the more you make.

### Steal Mechanic
Any post can be stolen for 2x the current price. The original author gets paid and the stealer owns future earnings. This creates a speculative market for viral content.

### Dutch Auction Pricing
Posts start at a base price (minimum $0.10) and decay over time following a logarithmic curve, creating optimal discovery windows.

```typescript
const currentPrice = basePrice * Math.max(0.1, 1 - Math.log(ageMinutes + 1) * 0.15)
const stealPrice = currentPrice * 2
const replyCost = currentPrice * 0.25
```

### Instant Settlement
Built on Solana — all payments settle on-chain in under 1 second with near-zero gas fees. Every transaction is verifiable on any Solana block explorer.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **Feed & Posts** | Real-time chronological feed with live price updates, earnings tracking, images, hashtags, and threaded replies |
| **Steal Mechanic** | Buy any post for 2x its current price; become the new owner and earn from future engagement |
| **Polls** | Create polls with expiration dates and vote in real time |
| **Explore** | Discover trending content, hashtags, and users |
| **Profiles** | Customizable profiles with avatars, banners, bios, wallet addresses, and earnings tracking |
| **Follow System** | Follow users and build your network |
| **Direct Messages** | Private one-on-one conversations with real-time delivery |
| **Notifications** | Alerts for likes, follows, replies, steals, and tips |
| **Bookmarks** | Save posts for later |
| **Marketplace** | Buy and sell usernames and viral posts via Solana |
| **Tipping** | Tip any post creator directly with SOL |
| **Dashboard** | Personal trading dashboard with equity curves and live positions |
| **Candlestick Charts** | Interactive price charts with TradingView integration |
| **Dark/Light Mode** | Full theme support with system preference detection |
| **API Docs** | Interactive API playground at `/docs` |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18, TypeScript |
| **Build** | Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Animations** | Framer Motion |
| **State** | TanStack React Query |
| **Routing** | React Router v6 |
| **Backend** | Lovable Cloud (Supabase) |
| **Auth** | Email/password authentication |
| **Blockchain** | Solana (`@solana/web3.js`) |
| **Charts** | Recharts, TradingView |
| **Forms** | React Hook Form + Zod |

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui primitives
│   ├── docs/             # API documentation components
│   ├── Navbar.tsx         # Main navigation
│   ├── PostCard.tsx       # Feed post component
│   ├── PostComposer.tsx   # Create new posts
│   ├── PollCreator.tsx    # Poll creation
│   ├── TipButton.tsx      # Solana tipping
│   └── ...
├── pages/                # Route pages
│   ├── Feed.tsx           # Main social feed
│   ├── Explore.tsx        # Discover content
│   ├── Messages.tsx       # Direct messaging
│   ├── Marketplace.tsx    # Buy/sell marketplace
│   ├── Dashboard.tsx      # Trading dashboard
│   ├── Profile.tsx        # User profile
│   ├── Docs.tsx           # API documentation
│   └── ...
├── hooks/                # Custom React hooks
│   ├── useAuth.tsx        # Authentication
│   ├── useTheme.tsx       # Dark/light mode
│   └── useBotSimulation.ts
├── integrations/         # Backend integrations
│   └── supabase/         # Database client & types
└── lib/                  # Utilities

supabase/
├── functions/            # Edge functions
│   ├── verify-tip/        # Tip verification
│   ├── verify-solana-tx/  # Solana tx verification
│   └── verify-marketplace-tx/  # Marketplace tx verification
└── config.toml
```

---

## 🗄 Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (avatar, bio, wallet, display name) |
| `posts` | Content posts with optional images, polls, reposts |
| `likes` | Post likes |
| `bookmarks` | Saved posts |
| `follows` | User follow relationships |
| `poll_options` | Poll answer choices |
| `poll_votes` | Poll votes |
| `conversations` | DM conversation threads |
| `messages` | Direct messages |
| `notifications` | User notifications |
| `tips` | Solana tip records |
| `live_positions` | Active trading positions |
| `marketplace_listings` | Items for sale (usernames, posts) |
| `marketplace_transactions` | Completed marketplace sales |
| `username_reservations` | Premium username claims |

---

## 📡 API Reference

**Base URL:** `https://api.mirage.app/v1`
**API Premium:** `https://api.mirage.app/v2-premium`

### Authentication

All API requests require a Bearer token:

```bash
curl -H "Authorization: Bearer xit_sk_live_..." https://api.mirage.app/v1/posts
```

Key prefixes:
- `xit_sk_` — Secret keys (server-side only)
- `xit_pk_` — Publishable keys (client-side safe)

Scopes: `read`, `write`, `full`

### Endpoints

#### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/posts` | List posts (paginated) |
| `POST` | `/posts` | Create a new post |
| `GET` | `/posts/:id` | Get a single post |
| `DELETE` | `/posts/:id` | Delete a post |
| `POST` | `/posts/:id/steal` | Steal a post (2x price) |
| `GET` | `/posts/:id/replies` | List replies |

#### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/:id` | Get user profile |
| `GET` | `/users/:id/posts` | Get user's posts |
| `GET` | `/users/:id/followers` | List followers |
| `GET` | `/users/:id/following` | List following |

#### Feed

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/feed` | Main feed (chronological) |
| `GET` | `/feed/trending` | Trending posts |
| `GET` | `/feed/hashtag/:tag` | Posts by hashtag |

### Webhooks

Subscribe to real-time events:

| Event | Description |
|-------|-------------|
| `post.created` | New post published |
| `post.stolen` | Post was stolen |
| `user.followed` | New follower |
| `message.received` | New DM received |

### Error Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not found |
| `429` | Rate limited |
| `500` | Server error |

---

## 🏁 Getting Started

```sh
git clone https://github.com/MirageSocials/MirageSocials.git
cd MirageSocials
npm install
npm run dev
```


---

## 📄 License

© 2025 Mirage. All rights reserved.

Xai.
