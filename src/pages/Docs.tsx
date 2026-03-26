import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Wallet, Shield, Zap, Settings, BarChart3, Code, Database, Rocket, ChevronRight, Search, Menu, X } from "lucide-react";
import CodeBlock from "@/components/docs/CodeBlock";
import ApiPlayground from "@/components/docs/ApiPlayground";
import { motion, AnimatePresence } from "framer-motion";

interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

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
    group: "ARCHITECTURE",
    items: [
      { id: "agent-architecture", label: "Agent Architecture" },
      { id: "wallet-system", label: "Wallet System" },
      { id: "trading-engine", label: "Trading Engine" },
    ],
  },
  {
    group: "AGENTS",
    items: [
      { id: "creating-agents", label: "Creating Agents" },
      { id: "strategies", label: "Strategies" },
      { id: "risk-management", label: "Risk Management" },
    ],
  },
  {
    group: "SOLANA",
    items: [
      { id: "solana-integration", label: "Solana Integration" },
      { id: "wallet-management", label: "Wallet Management" },
      { id: "on-chain", label: "On-Chain Verification" },
    ],
  },
  {
    group: "API REFERENCE",
    items: [
      { id: "api-overview", label: "Overview" },
      { id: "api-authentication", label: "Authentication" },
      { id: "api-agents", label: "Agents" },
      { id: "api-wallets", label: "Wallets" },
      { id: "api-trades", label: "Trades" },
      { id: "api-positions", label: "Positions" },
      { id: "api-webhooks", label: "Webhooks" },
      { id: "api-errors", label: "Error Codes" },
    ],
  },
];

const allItems = sidebarNav.flatMap((g) => g.items);

const Docs = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNav = useMemo(() => {
    if (!searchQuery.trim()) return sidebarNav;
    const q = searchQuery.toLowerCase();
    return sidebarNav
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)),
      }))
      .filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
    setSearchQuery("");
  };

  const sections: Record<string, DocSection> = {
    overview: {
      id: "overview",
      title: "Overview",
      content: (
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Luna Agent is an autonomous AI trading agent platform on Solana. Create AI agents with unique personalities,
            equip them with autonomous trading capabilities, and deploy them with their own custodial wallets.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Bot, title: "Autonomous AI Agents", desc: "Create agents with unique trading styles and behaviors. Agents operate autonomously using real-time market data and execute trades without manual intervention." },
              { icon: Wallet, title: "Custodial Solana Wallets", desc: "Each agent gets its own Solana wallet with encrypted key storage. Agents manage funds autonomously for trading operations." },
              { icon: Shield, title: "Risk Management", desc: "Configurable stop-loss, take-profit, and position sizing. Dynamic risk parameters that adapt to market conditions." },
              { icon: Rocket, title: "Instant Deployment", desc: "Deploy your agent in under 2 minutes. Configure strategy, fund the wallet, and go live immediately." },
            ].map((card) => (
              <div key={card.title} className="bg-card border border-border rounded-xl p-5">
                <card.icon className="h-5 w-5 text-primary mb-3" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">Key Capabilities</h3>
            <div className="space-y-3">
              {[
                { bold: "Define trading strategies", rest: "Choose from Scalper, Swing Trader, Trend Follower, or Degen styles that shape how your agent analyzes and trades" },
                { bold: "Execute trades autonomously", rest: "Agents analyze market data in real-time and execute buy/sell orders without human intervention" },
                { bold: "Manage risk dynamically", rest: "Configurable stop-loss and take-profit with automatic position sizing based on account balance" },
                { bold: "Track performance", rest: "Real-time P&L tracking, win rate analytics, equity curves, and detailed trade history" },
                { bold: "Own Solana wallet", rest: "Each agent gets a unique Solana keypair — deposit, withdraw, and verify on-chain" },
              ].map((item) => (
                <div key={item.bold} className="flex items-start gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-medium">{item.bold}</span> — {item.rest}
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
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get your first Luna Agent trading in under 2 minutes.
          </p>

          {[
            { step: "01", title: "Create an Account", desc: "Sign up with your email. No credit card required." },
            { step: "02", title: "Fund Your Balance", desc: "Deposit funds into your account. Your balance is shared across all agents." },
            { step: "03", title: "Deploy an Agent", desc: "Choose a trading pair, strategy, set risk parameters, and deploy. A new Solana wallet is generated automatically." },
            { step: "04", title: "Monitor & Adjust", desc: "Watch your agent trade in real-time. Pause, adjust parameters, or deploy more agents anytime." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 items-start">
              <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 rounded-lg px-2 py-1">{s.step}</span>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}

          <CodeBlock code={`$ luna init\n◉ Luna Agent v2.0.0\nGenerating agent wallet...\n✓ Wallet: 7xKXt...9fQm (Solana)\nLoading strategy: Scalper\n✓ Agent deployed. Scanning markets...`} className="p-4">
            <div className="text-muted-foreground mb-2">$ luna init</div>
            <div className="text-primary">◉ Luna Agent v2.0.0</div>
            <div className="text-muted-foreground">Generating agent wallet...</div>
            <div className="text-primary">✓ Wallet: 7xKXt...9fQm (Solana)</div>
            <div className="text-muted-foreground">Loading strategy: Scalper</div>
            <div className="text-primary">✓ Agent deployed. Scanning markets...</div>
          </CodeBlock>
        </div>
      ),
    },
    "what-you-can-build": {
      id: "what-you-can-build",
      title: "What You Can Build",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Luna Agent supports a variety of autonomous trading configurations.
          </p>
          <div className="space-y-4">
            {[
              { title: "Scalping Bots", desc: "High-frequency agents that capitalize on small price movements with tight risk management on 1m-5m timeframes." },
              { title: "Swing Trading Agents", desc: "Medium-term agents that capture multi-day moves by riding trend reversals and breakouts." },
              { title: "Trend Followers", desc: "Agents that identify and follow strong market trends with trailing stops and dynamic position sizing." },
              { title: "Multi-Agent Portfolios", desc: "Deploy multiple agents across different pairs and strategies for diversified, autonomous portfolio management." },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-primary/30 pl-4">
                <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "agent-architecture": {
      id: "agent-architecture",
      title: "Agent Architecture",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Each Luna Agent is a self-contained trading unit with its own wallet, strategy engine, and risk parameters.
          </p>
          <CodeBlock code={`// Agent structure\nAgent {\n  id: string\n  wallet: SolanaKeypair\n  strategy: Scalp | Swing | Trend | Degen\n  pair: string\n  stopLoss: percentage\n  takeProfit: percentage\n  positionSize: number\n  state: active | paused\n}`}>
            <div className="space-y-2">
              <div className="text-muted-foreground">{"// Agent structure"}</div>
              <div className="text-foreground">{"Agent {"}</div>
              <div className="text-foreground pl-4">id: <span className="text-primary">string</span></div>
              <div className="text-foreground pl-4">wallet: <span className="text-primary">SolanaKeypair</span></div>
              <div className="text-foreground pl-4">strategy: <span className="text-primary">Scalp | Swing | Trend | Degen</span></div>
              <div className="text-foreground pl-4">pair: <span className="text-primary">string</span></div>
              <div className="text-foreground pl-4">stopLoss: <span className="text-primary">percentage</span></div>
              <div className="text-foreground pl-4">takeProfit: <span className="text-primary">percentage</span></div>
              <div className="text-foreground pl-4">positionSize: <span className="text-primary">number</span></div>
              <div className="text-foreground pl-4">state: <span className="text-primary">active | paused</span></div>
              <div className="text-foreground">{"}"}</div>
            </div>
          </CodeBlock>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Agents run on a tick-based simulation engine that updates prices, evaluates positions, and executes trades
            based on the configured strategy parameters. Each tick checks SL/TP conditions and manages trade lifecycle.
          </p>
        </div>
      ),
    },
    "wallet-system": {
      id: "wallet-system",
      title: "Wallet System",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every agent deployed on Luna Agent receives its own unique Solana wallet, generated using Ed25519 keypairs
            from the <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">@solana/web3.js</code> library.
          </p>
          <div className="space-y-3">
            {[
              { bold: "Keypair Generation", rest: "A new Ed25519 keypair is generated client-side when you deploy an agent." },
              { bold: "Public Key", rest: "Used as the wallet address. Displayed in the dashboard and copyable for on-chain verification." },
              { bold: "Secret Key", rest: "Stored locally in hex format. Used for signing transactions autonomously." },
              { bold: "Fund Management", rest: "Deposit and withdraw from the shared account balance. Each agent's position size is drawn from this pool." },
            ].map((item) => (
              <div key={item.bold} className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">{item.bold}</span> — {item.rest}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "trading-engine": {
      id: "trading-engine",
      title: "Trading Engine",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The trading engine runs a continuous simulation loop that manages price updates, position entries, and exits.
          </p>
          <CodeBlock code={`// Trade lifecycle\n1. Price tick → update market data\n2. No position? → evaluate entry signal\n3. Entry signal → open LONG or SHORT\n4. Position open → monitor SL/TP\n5. SL/TP hit → close position, record P&L`}>
            <div className="space-y-1">
              <div className="text-muted-foreground">{"// Trade lifecycle"}</div>
              <div className="text-foreground">1. Price tick → update market data</div>
              <div className="text-foreground">2. No position? → evaluate entry signal</div>
              <div className="text-foreground">3. Entry signal → open LONG or SHORT</div>
              <div className="text-foreground">4. Position open → monitor SL/TP</div>
              <div className="text-primary">5. SL/TP hit → close position, record P&L</div>
            </div>
          </CodeBlock>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The engine ticks every 800ms, updating candlestick data and evaluating all active agents in parallel.
            New candles are generated every 5 seconds for chart visualization.
          </p>
        </div>
      ),
    },
    "creating-agents": {
      id: "creating-agents",
      title: "Creating Agents",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            To create a new agent, click the <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">+</code> button
            in the dashboard sidebar.
          </p>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Configuration Options</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p><span className="text-foreground font-medium">Trading Pair</span> — BTC/USDT, ETH/USDT, SOL/USDT, ARB/USDT, DOGE/USDT, AVAX/USDT, OP/USDT, MATIC/USDT</p>
                <p><span className="text-foreground font-medium">Strategy</span> — Scalp, Swing, Trend, or News-Based</p>
                <p><span className="text-foreground font-medium">Stop Loss %</span> — Maximum loss before auto-closing (default: 2%)</p>
                <p><span className="text-foreground font-medium">Take Profit %</span> — Target gain before auto-closing (default: 4%)</p>
                <p><span className="text-foreground font-medium">Position Size $</span> — Amount allocated per trade (drawn from balance)</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    strategies: {
      id: "strategies",
      title: "Strategies",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Luna Agent supports four core trading strategies.
          </p>
          <div className="space-y-4">
            {[
              { emoji: "⚡", name: "Scalp", desc: "High-frequency entries with tight SL/TP (typically 1-3%). Best for volatile pairs like BTC and ETH." },
              { emoji: "🔄", name: "Swing", desc: "Medium-term holds with wider SL/TP (5-12%). Captures multi-day price swings on trending markets." },
              { emoji: "📈", name: "Trend", desc: "Follows strong directional moves with dynamic trailing stops. Best for sustained bull/bear runs." },
              { emoji: "📰", name: "News-Based", desc: "Reacts to market sentiment and news events. Higher risk, higher reward potential." },
            ].map((s) => (
              <div key={s.name} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                <span className="text-lg">{s.emoji}</span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{s.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "risk-management": {
      id: "risk-management",
      title: "Risk Management",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every agent enforces strict risk parameters to protect your capital.
          </p>
          <div className="space-y-3">
            {[
              { bold: "Stop Loss", rest: "Automatically closes a losing position when the loss exceeds the configured percentage." },
              { bold: "Take Profit", rest: "Locks in gains by closing profitable positions at the target percentage." },
              { bold: "Position Sizing", rest: "Each agent trades with a fixed dollar amount, preventing overexposure." },
              { bold: "Balance Check", rest: "Agents cannot be deployed if position size exceeds available balance." },
            ].map((item) => (
              <div key={item.bold} className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">{item.bold}</span> — {item.rest}
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
          <p className="text-sm text-muted-foreground leading-relaxed">
            Luna Agent is built natively on Solana using <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">@solana/web3.js</code>.
          </p>
          <CodeBlock code={`// Wallet generation\nimport { Keypair } from '@solana/web3.js'\n\nconst keypair = Keypair.generate()\nconst address = keypair.publicKey.toBase58()\n\n// Each agent gets a unique keypair on creation`}>
            <div className="space-y-1">
              <div className="text-muted-foreground">{"// Wallet generation"}</div>
              <div className="text-foreground">{"import { Keypair } from '@solana/web3.js'"}</div>
              <div className="text-foreground mt-2">{"const keypair = Keypair.generate()"}</div>
              <div className="text-foreground">{"const address = keypair.publicKey.toBase58()"}</div>
              <div className="text-primary mt-2">{"// Each agent gets a unique keypair on creation"}</div>
            </div>
          </CodeBlock>
        </div>
      ),
    },
    "wallet-management": {
      id: "wallet-management",
      title: "Wallet Management",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Manage agent wallets from the dashboard. Each wallet address is displayed with a copy button for easy on-chain verification.
          </p>
          <div className="space-y-3 text-xs text-muted-foreground">
            <p><span className="text-foreground font-medium">View Address</span> — Truncated in the UI, full address available on copy.</p>
            <p><span className="text-foreground font-medium">Deposit</span> — Add funds to your shared balance from the sidebar.</p>
            <p><span className="text-foreground font-medium">Withdraw</span> — Remove funds back to your external wallet.</p>
            <p><span className="text-foreground font-medium">Balance Tracking</span> — Real-time equity curve shows your balance over time.</p>
          </div>
        </div>
      ),
    },
    "on-chain": {
      id: "on-chain",
      title: "On-Chain Verification",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every agent wallet is a real Solana address. You can verify its existence and activity on any Solana block explorer.
          </p>
          <CodeBlock code={`Verify on Solscan:\nhttps://solscan.io/account/<agent_wallet_address>`} className="p-4">
            <div className="text-muted-foreground mb-1">Verify on Solscan:</div>
            <div className="text-primary">https://solscan.io/account/{"<agent_wallet_address>"}</div>
          </CodeBlock>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Agent wallets are generated client-side using cryptographically secure Ed25519 keypairs.
            No private keys leave your browser.
          </p>
        </div>
      ),
    },

    /* ── API REFERENCE ── */
    "api-overview": {
      id: "api-overview",
      title: "API Overview",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Luna Agent REST API lets you manage agents, wallets, trades, and positions programmatically.
            All endpoints return JSON and use standard HTTP status codes.
          </p>
          <CodeBlock code={`// Base URL\nhttps://api.lunaagent.io/v1\n\n// Content-Type\napplication/json`}>
            <div className="space-y-2">
              <div className="text-muted-foreground">{"// Base URL"}</div>
              <div className="text-primary">https://api.lunaagent.io/v1</div>
              <div className="text-muted-foreground mt-3">{"// Content-Type"}</div>
              <div className="text-foreground">application/json</div>
            </div>
          </CodeBlock>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">Rate Limits</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><span className="text-foreground font-medium">Free tier</span> — 60 requests / minute</p>
              <p><span className="text-foreground font-medium">Pro tier</span> — 300 requests / minute</p>
              <p><span className="text-foreground font-medium">Enterprise</span> — Custom limits</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Rate limit headers <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">X-RateLimit-Remaining</code> and <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">X-RateLimit-Reset</code> are included in every response.
          </p>
        </div>
      ),
    },
    "api-authentication": {
      id: "api-authentication",
      title: "Authentication",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Authenticate using a Bearer token in the <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">Authorization</code> header. Generate API keys from your dashboard settings.
          </p>
          <CodeBlock code={`// Example request\ncurl https://api.lunaagent.io/v1/agents \\\n  -H "Authorization: Bearer luna_sk_..."`}>
            <div className="space-y-1">
              <div className="text-muted-foreground">{"// Example request"}</div>
              <div className="text-foreground">curl https://api.lunaagent.io/v1/agents \</div>
              <div className="text-foreground pl-4">-H <span className="text-primary">"Authorization: Bearer luna_sk_..."</span></div>
            </div>
          </CodeBlock>
          <div className="space-y-3">
            {[
              { bold: "API Key Prefix", rest: "All keys start with luna_sk_ for secret keys and luna_pk_ for publishable keys." },
              { bold: "Scopes", rest: "Keys can be scoped to read-only, trade, or full-access permissions." },
              { bold: "Rotation", rest: "Rotate keys instantly from the dashboard. Old keys are revoked immediately." },
            ].map((item) => (
              <div key={item.bold} className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">{item.bold}</span> — {item.rest}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "api-agents": {
      id: "api-agents",
      title: "Agents API",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create, list, update, and delete trading agents.
          </p>
          <ApiPlayground method="GET" path="/v1/agents" desc="List all agents for the authenticated user." sampleResponse={`[\n  {\n    "id": "ag_01H...",\n    "pair": "SOL/USDT",\n    "strategy": "scalp",\n    "state": "active",\n    "pnl": 142.50\n  }\n]`} />
          <ApiPlayground method="POST" path="/v1/agents" desc="Create a new agent with strategy and risk config." sampleBody={`{\n  "pair": "SOL/USDT",\n  "strategy": "scalp",\n  "stop_loss": 2.0,\n  "take_profit": 4.0,\n  "position_size": 500\n}`} sampleResponse={`{\n  "id": "ag_02K...",\n  "pair": "SOL/USDT",\n  "strategy": "scalp",\n  "state": "active",\n  "wallet": "7xKXt...9fQm"\n}`} />
          <ApiPlayground method="GET" path="/v1/agents/:id" desc="Retrieve a single agent by ID." sampleResponse={`{\n  "id": "ag_01H...",\n  "pair": "SOL/USDT",\n  "strategy": "scalp",\n  "stop_loss": 2.0,\n  "take_profit": 4.0,\n  "position_size": 500,\n  "state": "active"\n}`} />
          <ApiPlayground method="PATCH" path="/v1/agents/:id" desc="Update agent parameters (strategy, SL, TP, etc.)." sampleBody={`{\n  "stop_loss": 3.0,\n  "take_profit": 6.0\n}`} sampleResponse={`{\n  "id": "ag_01H...",\n  "stop_loss": 3.0,\n  "take_profit": 6.0,\n  "updated_at": "2026-03-26T14:30:00Z"\n}`} />
          <ApiPlayground method="DELETE" path="/v1/agents/:id" desc="Delete an agent and close all open positions." sampleResponse={`{\n  "deleted": true,\n  "positions_closed": 1\n}`} />
          <ApiPlayground method="POST" path="/v1/agents/:id/pause" desc="Pause an active agent." sampleResponse={`{\n  "id": "ag_01H...",\n  "state": "paused"\n}`} />
          <ApiPlayground method="POST" path="/v1/agents/:id/resume" desc="Resume a paused agent." sampleResponse={`{\n  "id": "ag_01H...",\n  "state": "active"\n}`} />
        </div>
      ),
    },
    "api-wallets": {
      id: "api-wallets",
      title: "Wallets API",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Query agent wallet information and balance history.
          </p>
          <ApiPlayground method="GET" path="/v1/wallets" desc="List all wallets across your agents." sampleResponse={`[\n  {\n    "address": "7xKXt...9fQm",\n    "balance_sol": 12.45,\n    "balance_usdt": 3420.80,\n    "agent_id": "ag_01H..."\n  }\n]`} />
          <ApiPlayground method="GET" path="/v1/wallets/:address" desc="Get wallet details by Solana address." sampleResponse={`{\n  "address": "7xKXt...9fQm",\n  "balance_sol": 12.45,\n  "balance_usdt": 3420.80,\n  "agent_id": "ag_01H..."\n}`} />
          <ApiPlayground method="GET" path="/v1/wallets/:address/balance" desc="Get current SOL and token balances." sampleResponse={`{\n  "sol": 12.45,\n  "usdt": 3420.80,\n  "total_usd": 5280.50\n}`} />
          <ApiPlayground method="GET" path="/v1/wallets/:address/transactions" desc="List on-chain transactions for a wallet." sampleResponse={`[\n  {\n    "signature": "3xK9f...",\n    "type": "transfer",\n    "amount": 2.5,\n    "timestamp": "2026-03-26T14:30:00Z"\n  }\n]`} />
        </div>
      ),
    },
    "api-trades": {
      id: "api-trades",
      title: "Trades API",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Access trade history and execution details.
          </p>
          <ApiPlayground method="GET" path="/v1/trades" desc="List all trades with pagination and filters." sampleResponse={`[\n  {\n    "id": "tr_01X...",\n    "pair": "SOL/USDT",\n    "direction": "long",\n    "entry_price": 142.35,\n    "exit_price": 145.80,\n    "pnl": 17.25,\n    "status": "closed"\n  }\n]`} />
          <ApiPlayground method="GET" path="/v1/trades/:id" desc="Get a single trade with full execution details." sampleResponse={`{\n  "id": "tr_01X...",\n  "agent_id": "ag_01H...",\n  "pair": "SOL/USDT",\n  "direction": "long",\n  "entry_price": 142.35,\n  "exit_price": 145.80,\n  "pnl": 17.25,\n  "opened_at": "2026-03-26T14:00:00Z",\n  "closed_at": "2026-03-26T14:30:00Z"\n}`} />
          <ApiPlayground method="GET" path="/v1/agents/:id/trades" desc="List trades for a specific agent." sampleResponse={`[\n  {\n    "id": "tr_01X...",\n    "pair": "SOL/USDT",\n    "pnl": 17.25,\n    "status": "closed"\n  }\n]`} />
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">Query Parameters</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">limit</code> — Number of results (default 50, max 200)</p>
              <p><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">offset</code> — Pagination offset</p>
              <p><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">pair</code> — Filter by trading pair</p>
              <p><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">status</code> — Filter: <span className="text-foreground">open</span>, <span className="text-foreground">closed</span>, <span className="text-foreground">liquidated</span></p>
              <p><code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">from</code> / <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">to</code> — ISO 8601 date range</p>
            </div>
          </div>
        </div>
      ),
    },
    "api-positions": {
      id: "api-positions",
      title: "Positions API",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Monitor and manage open positions in real-time.
          </p>
          {[
            { method: "GET", path: "/v1/positions", desc: "List all open positions." },
            { method: "GET", path: "/v1/positions/:id", desc: "Get position details with live P&L." },
            { method: "POST", path: "/v1/positions/:id/close", desc: "Manually close an open position at market price." },
            { method: "PATCH", path: "/v1/positions/:id", desc: "Update SL/TP on an open position." },
          ].map((ep) => (
            <div key={ep.method + ep.path} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  ep.method === "GET" ? "bg-blue-500/10 text-blue-400" :
                  ep.method === "POST" ? "bg-emerald-500/10 text-emerald-400" :
                  "bg-amber-500/10 text-amber-400"
                }`}>{ep.method}</span>
                <code className="text-xs text-foreground font-mono">{ep.path}</code>
              </div>
              <p className="text-xs text-muted-foreground">{ep.desc}</p>
            </div>
          ))}
          <div className="bg-card border border-border rounded-xl p-5 font-mono text-xs space-y-1">
            <div className="text-muted-foreground">{"// Position response"}</div>
            <div className="text-foreground">{"{"}</div>
            <div className="text-foreground pl-4">"id": <span className="text-primary">"pos_9xK..."</span>,</div>
            <div className="text-foreground pl-4">"pair": <span className="text-primary">"SOL/USDT"</span>,</div>
            <div className="text-foreground pl-4">"direction": <span className="text-primary">"long"</span>,</div>
            <div className="text-foreground pl-4">"entry_price": <span className="text-primary">142.35</span>,</div>
            <div className="text-foreground pl-4">"current_price": <span className="text-primary">145.80</span>,</div>
            <div className="text-foreground pl-4">"pnl_percent": <span className="text-primary">2.42</span>,</div>
            <div className="text-foreground pl-4">"stop_loss": <span className="text-primary">139.50</span>,</div>
            <div className="text-foreground pl-4">"take_profit": <span className="text-primary">148.05</span></div>
            <div className="text-foreground">{"}"}</div>
          </div>
        </div>
      ),
    },
    "api-webhooks": {
      id: "api-webhooks",
      title: "Webhooks",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Receive real-time notifications when events occur — trades executed, positions closed, agents paused, etc.
          </p>
          {[
            { method: "POST", path: "/v1/webhooks", desc: "Register a new webhook endpoint." },
            { method: "GET", path: "/v1/webhooks", desc: "List all registered webhooks." },
            { method: "DELETE", path: "/v1/webhooks/:id", desc: "Remove a webhook." },
          ].map((ep) => (
            <div key={ep.method + ep.path} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  ep.method === "GET" ? "bg-blue-500/10 text-blue-400" :
                  ep.method === "POST" ? "bg-emerald-500/10 text-emerald-400" :
                  "bg-red-500/10 text-red-400"
                }`}>{ep.method}</span>
                <code className="text-xs text-foreground font-mono">{ep.path}</code>
              </div>
              <p className="text-xs text-muted-foreground">{ep.desc}</p>
            </div>
          ))}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">Event Types</h3>
            <div className="space-y-2 text-xs text-muted-foreground font-mono">
              <p><span className="text-primary">trade.executed</span> — A trade was opened or closed</p>
              <p><span className="text-primary">position.closed</span> — A position hit SL/TP or was manually closed</p>
              <p><span className="text-primary">agent.paused</span> — An agent was paused</p>
              <p><span className="text-primary">agent.resumed</span> — An agent was resumed</p>
              <p><span className="text-primary">wallet.funded</span> — Funds were deposited to a wallet</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 font-mono text-xs space-y-1">
            <div className="text-muted-foreground">{"// Webhook payload"}</div>
            <div className="text-foreground">{"{"}</div>
            <div className="text-foreground pl-4">"event": <span className="text-primary">"trade.executed"</span>,</div>
            <div className="text-foreground pl-4">"timestamp": <span className="text-primary">"2026-03-26T14:30:00Z"</span>,</div>
            <div className="text-foreground pl-4">"data": {"{ ... }"}</div>
            <div className="text-foreground">{"}"}</div>
          </div>
        </div>
      ),
    },
    "api-errors": {
      id: "api-errors",
      title: "Error Codes",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            All errors follow a consistent format with an error code and human-readable message.
          </p>
          <div className="bg-card border border-border rounded-xl p-5 font-mono text-xs space-y-1">
            <div className="text-muted-foreground">{"// Error response"}</div>
            <div className="text-foreground">{"{"}</div>
            <div className="text-foreground pl-4">"error": {"{"}</div>
            <div className="text-foreground pl-8">"code": <span className="text-primary">"insufficient_balance"</span>,</div>
            <div className="text-foreground pl-8">"message": <span className="text-primary">"Position size exceeds available balance"</span>,</div>
            <div className="text-foreground pl-8">"status": <span className="text-primary">400</span></div>
            <div className="text-foreground pl-4">{"}"}</div>
            <div className="text-foreground">{"}"}</div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">HTTP Status Codes</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><span className="text-foreground font-medium font-mono">200</span> — Success</p>
              <p><span className="text-foreground font-medium font-mono">201</span> — Created</p>
              <p><span className="text-foreground font-medium font-mono">400</span> — Bad request / validation error</p>
              <p><span className="text-foreground font-medium font-mono">401</span> — Unauthorized (missing or invalid API key)</p>
              <p><span className="text-foreground font-medium font-mono">403</span> — Forbidden (insufficient permissions)</p>
              <p><span className="text-foreground font-medium font-mono">404</span> — Resource not found</p>
              <p><span className="text-foreground font-medium font-mono">429</span> — Rate limited</p>
              <p><span className="text-foreground font-medium font-mono">500</span> — Internal server error</p>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">Common Error Codes</h3>
            <div className="space-y-2 text-xs text-muted-foreground font-mono">
              <p><span className="text-primary">insufficient_balance</span> — Not enough funds for the requested operation</p>
              <p><span className="text-primary">agent_not_found</span> — The specified agent does not exist</p>
              <p><span className="text-primary">position_not_found</span> — No open position with the given ID</p>
              <p><span className="text-primary">invalid_strategy</span> — Unrecognized strategy type</p>
              <p><span className="text-primary">rate_limited</span> — Too many requests, retry after cooldown</p>
              <p><span className="text-primary">invalid_pair</span> — Trading pair not supported</p>
            </div>
          </div>
        </div>
      ),
    },
  };

  const currentSection = sections[activeSection] || sections.overview;

  const sidebarContent = (
    <>
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-mono bg-accent/50 border border-border rounded-lg pl-8 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all"
          />
        </div>
      </div>

      <nav className="p-3 space-y-5 flex-1 overflow-y-auto">
        {filteredNav.map((group) => (
          <div key={group.group}>
            <div className="text-[9px] tracking-widest uppercase text-muted-foreground font-mono mb-2 px-2">
              {group.group}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSection(item.id)}
                  className={`w-full text-left text-xs px-2 py-1.5 rounded-md transition-colors ${
                    activeSection === item.id
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        {filteredNav.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4 font-mono">No results found</p>
        )}
      </nav>

      <div className="p-4 border-t border-border">
        <a href="https://x.com/LunaOnperp" target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors font-mono">
          Twitter ↗
        </a>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 border-r border-border bg-background fixed top-0 left-0 h-screen flex-col">
        <div className="p-4 border-b border-border">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-xs font-mono text-foreground">
            <span className="text-muted-foreground">◎</span>
            <span className="font-bold">luna</span>
            <span className="text-muted-foreground font-normal">Docs</span>
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 bg-background/90 backdrop-blur-lg border-b border-border flex items-center justify-between px-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-xs font-mono text-foreground">
          <span className="text-muted-foreground">◎</span>
          <span className="font-bold">luna</span>
          <span className="text-muted-foreground font-normal">Docs</span>
        </button>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
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
              className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed top-12 left-0 bottom-0 z-50 w-64 bg-background border-r border-border flex flex-col"
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
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </button>

          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-2xl font-bold font-display text-foreground mb-6">{currentSection.title}</h1>
            {currentSection.content}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Docs;
