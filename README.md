# Mirage

**Mirage** is a social media platform with a professional, clean "trading terminal" aesthetic — where posts act as micro-markets. Users can create content, trade posts, tip creators with Solana, and engage with a social-financial community.

**Live:** [mirage.app](https://perp-buddy-ai.lovable.app)

---

## ✨ Features

### Social
- **Feed** — Post, like, repost, comment, and bookmark content
- **Polls** — Create polls with expiration dates and vote in real time
- **Hashtags** — Discover trending topics and browse hashtag pages
- **Explore** — Find trending content and users
- **User Profiles** — Customizable profiles with avatars, banners, bios, and wallet addresses
- **Follow System** — Follow users and build your network
- **Notifications** — Real-time alerts for likes, follows, replies, and tips

### Messaging
- **Direct Messages** — Private one-on-one conversations with real-time delivery

### Trading & Finance
- **Dashboard** — Personal trading dashboard with equity curves and live positions
- **Candlestick Charts** — Interactive price charts
- **TradingView Widget** — Embedded TradingView integration
- **Live Positions** — Track open trades with entry price, leverage, and direction

### Marketplace
- **Buy & Sell Usernames** — Trade premium usernames via Solana transactions
- **Buy & Sell Posts** — Marketplace listings for viral content
- **Solana Tipping** — Tip any post creator directly with SOL
- **Transaction Verification** — On-chain verification via backend functions

### Other
- **API Documentation** — Interactive API playground at `/docs`
- **Dark/Light Mode** — Full theme support with system preference detection
- **Bookmarks** — Save posts for later
- **Settings** — Account and preference management
- **Legal Pages** — Terms of Service, Privacy Policy, and Contact

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
| **Blockchain** | Solana (`@solana/web3.js`) — tips, marketplace |
| **Charts** | Recharts, TradingView |
| **Forms** | React Hook Form + Zod validation |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui primitives
│   ├── docs/            # API documentation components
│   ├── Navbar.tsx        # Main navigation
│   ├── PostCard.tsx      # Feed post component
│   ├── PostComposer.tsx  # Create new posts
│   ├── PollCreator.tsx   # Poll creation
│   ├── TipButton.tsx     # Solana tipping
│   └── ...
├── pages/               # Route pages
│   ├── Feed.tsx          # Main social feed
│   ├── Explore.tsx       # Discover content
│   ├── Messages.tsx      # Direct messaging
│   ├── Marketplace.tsx   # Buy/sell marketplace
│   ├── Dashboard.tsx     # Trading dashboard
│   ├── Profile.tsx       # User profile
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx       # Authentication
│   ├── useTheme.tsx      # Dark/light mode
│   └── useBotSimulation.ts
├── integrations/        # Backend integrations
│   └── supabase/        # Database client & types
└── lib/                 # Utilities
    ├── utils.ts
    ├── hashtags.tsx
    └── sounds.ts

supabase/
├── functions/           # Edge functions
│   ├── verify-tip/
│   ├── verify-solana-tx/
│   └── verify-marketplace-tx/
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
| `marketplace_listings` | Items for sale |
| `marketplace_transactions` | Completed marketplace sales |
| `username_reservations` | Premium username claims |

---

## 🚀 Getting Started

```sh
# Clone the repo
git clone https://github.com/YOUR_USERNAME/MirageSocials.git

# Install dependencies
cd MirageSocials
npm install

# Start dev server
npm run dev
```

---

## 📦 Deployment

Open [Lovable](https://lovable.dev) → **Share → Publish**.

### Custom Domain

**Project → Settings → Domains → Connect Domain**
[Learn more](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 📄 License

© 2025 Mirage. All rights reserved.
