import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ARB/USDT", "DOGE/USDT", "AVAX/USDT", "OP/USDT", "MATIC/USDT"];
const strategies = ["Scalp", "Swing", "Trend", "News-Based"];

interface Bot {
  id: number;
  pair: string;
  strategy: string;
  sl: string;
  tp: string;
  active: boolean;
  pnl: string;
  positive: boolean;
}

const initialBots: Bot[] = [
  { id: 1, pair: "BTC/USDT", strategy: "Scalp", sl: "2%", tp: "4%", active: true, pnl: "+$2,847", positive: true },
  { id: 2, pair: "ETH/USDT", strategy: "Swing", sl: "5%", tp: "12%", active: true, pnl: "+$1,204", positive: true },
  { id: 3, pair: "SOL/USDT", strategy: "Trend", sl: "3%", tp: "8%", active: false, pnl: "-$312", positive: false },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [bots, setBots] = useState<Bot[]>(initialBots);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [sl, setSl] = useState("2");
  const [tp, setTp] = useState("4");

  const toggleBot = (id: number) => {
    setBots(bots.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  };

  const createBot = () => {
    const newBot: Bot = {
      id: Date.now(),
      pair: selectedPair,
      strategy: selectedStrategy,
      sl: `${sl}%`,
      tp: `${tp}%`,
      active: true,
      pnl: "$0",
      positive: true,
    };
    setBots([newBot, ...bots]);
    setShowCreate(false);
    setSl("2");
    setTp("4");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold tracking-tight text-foreground">
              perp<span className="text-muted-foreground font-normal">bot</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-muted-foreground uppercase">Total P&L</div>
              <div className="text-sm font-bold text-positive">+$3,739</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground">
              U
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Bots", value: bots.filter((b) => b.active).length.toString() },
            { label: "Total Trades", value: "1,589" },
            { label: "Win Rate", value: "67%" },
            { label: "24h P&L", value: "+$847" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border p-4 bg-background">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
              <div className="text-xl font-bold text-foreground mt-1">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Create Bot */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Your Bots</h2>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="inline-flex items-center gap-2 text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            New Bot
          </button>
        </div>

        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-2xl border border-border p-6 bg-secondary/50">
                <h3 className="text-sm font-semibold text-foreground mb-4">Configure New Bot</h3>

                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  {/* Pair */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Trading Pair</label>
                    <div className="flex flex-wrap gap-2">
                      {pairs.map((p) => (
                        <button
                          key={p}
                          onClick={() => setSelectedPair(p)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            selectedPair === p
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strategy */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Strategy</label>
                    <div className="flex flex-wrap gap-2">
                      {strategies.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedStrategy(s)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            selectedStrategy === s
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SL/TP */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Stop Loss (%)</label>
                    <input
                      type="number"
                      value={sl}
                      onChange={(e) => setSl(e.target.value)}
                      className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Take Profit (%)</label>
                    <input
                      type="number"
                      value={tp}
                      onChange={(e) => setTp(e.target.value)}
                      className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={createBot}
                    className="text-sm font-medium bg-foreground text-background px-6 py-2.5 rounded-full hover:bg-foreground/90 transition-all active:scale-95"
                  >
                    Deploy Bot
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bot List */}
        <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
          {bots.map((bot) => (
            <motion.div
              key={bot.id}
              layout
              className="px-6 py-4 flex items-center justify-between gap-4 bg-background hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full ${bot.active ? "bg-positive" : "bg-border"}`} />
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">{bot.pair}</span>
                <span className="text-xs text-foreground bg-accent px-2 py-0.5 rounded-md">{bot.strategy}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">SL: {bot.sl}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">TP: {bot.tp}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {bot.positive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-positive" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-negative" />
                  )}
                  <span className={`text-sm font-semibold ${bot.positive ? "text-positive" : "text-negative"}`}>
                    {bot.pnl}
                  </span>
                </div>
                <button
                  onClick={() => toggleBot(bot.id)}
                  className={`p-2 rounded-full transition-all ${
                    bot.active
                      ? "bg-foreground text-background hover:bg-foreground/80"
                      : "bg-secondary text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {bot.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {bots.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No bots yet. Create your first one above.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
