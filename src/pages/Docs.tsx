import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Wallet, Shield, Zap, Settings, BarChart3, Code, Database, Rocket, ChevronRight, Search, Menu, X } from "lucide-react";
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
];

const Docs = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

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

          <div className="bg-card border border-border rounded-xl p-4 font-mono text-xs">
            <div className="text-muted-foreground mb-2">$ luna init</div>
            <div className="text-primary">◉ Luna Agent v2.0.0</div>
            <div className="text-muted-foreground">Generating agent wallet...</div>
            <div className="text-primary">✓ Wallet: 7xKXt...9fQm (Solana)</div>
            <div className="text-muted-foreground">Loading strategy: Scalper</div>
            <div className="text-primary">✓ Agent deployed. Scanning markets...</div>
          </div>
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
          <div className="bg-card border border-border rounded-xl p-5 font-mono text-xs space-y-2">
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
          <div className="bg-card border border-border rounded-xl p-5 font-mono text-xs space-y-1">
            <div className="text-muted-foreground">{"// Trade lifecycle"}</div>
            <div className="text-foreground">1. Price tick → update market data</div>
            <div className="text-foreground">2. No position? → evaluate entry signal</div>
            <div className="text-foreground">3. Entry signal → open LONG or SHORT</div>
            <div className="text-foreground">4. Position open → monitor SL/TP</div>
            <div className="text-primary">5. SL/TP hit → close position, record P&L</div>
          </div>
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
          <div className="bg-card border border-border rounded-xl p-5 font-mono text-xs space-y-1">
            <div className="text-muted-foreground">{"// Wallet generation"}</div>
            <div className="text-foreground">{"import { Keypair } from '@solana/web3.js'"}</div>
            <div className="text-foreground mt-2">{"const keypair = Keypair.generate()"}</div>
            <div className="text-foreground">{"const address = keypair.publicKey.toBase58()"}</div>
            <div className="text-primary mt-2">{"// Each agent gets a unique keypair on creation"}</div>
          </div>
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
          <div className="bg-card border border-border rounded-xl p-4 font-mono text-xs">
            <div className="text-muted-foreground mb-1">Verify on Solscan:</div>
            <div className="text-primary">https://solscan.io/account/{"<agent_wallet_address>"}</div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Agent wallets are generated client-side using cryptographically secure Ed25519 keypairs.
            No private keys leave your browser.
          </p>
        </div>
      ),
    },
  };

  const currentSection = sections[activeSection] || sections.overview;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border bg-background fixed top-0 left-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-border">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-xs font-mono text-foreground">
            <span className="text-muted-foreground">◎</span>
            <span className="font-bold">luna</span>
            <span className="text-muted-foreground font-normal">Docs</span>
          </button>
        </div>

        <nav className="p-3 space-y-5">
          {sidebarNav.map((group) => (
            <div key={group.group}>
              <div className="text-[9px] tracking-widest uppercase text-muted-foreground font-mono mb-2 px-2">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
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
        </nav>

        <div className="p-4 border-t border-border mt-4">
          <a href="https://x.com/LunaOnperp" target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors font-mono">
            Twitter ↗
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56">
        <div className="max-w-2xl mx-auto px-8 py-8">
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
