import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, Plus, TrendingUp, TrendingDown, Trash2, Activity, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBotSimulation } from "@/hooks/useBotSimulation";

const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ARB/USDT", "DOGE/USDT", "AVAX/USDT", "OP/USDT", "MATIC/USDT"];
const strategies = ["Scalp", "Swing", "Trend", "News-Based"];

const formatPnl = (v: number) => {
  const sign = v >= 0 ? "+" : "";
  return `${sign}$${Math.abs(v).toFixed(2)}`;
};

const formatPrice = (price: number) => {
  if (price >= 1000) return price.toFixed(2);
  if (price >= 1) return price.toFixed(3);
  return price.toFixed(5);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { bots, tradeLog, toggleBot, createBot, deleteBot, totalPnl, totalTrades, winRate } = useBotSimulation();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [sl, setSl] = useState("2");
  const [tp, setTp] = useState("4");

  const handleCreate = () => {
    createBot(selectedPair, selectedStrategy, `${sl}%`, `${tp}%`);
    setShowCreate(false);
    setSl("2");
    setTp("4");
  };

  const activeBots = bots.filter((b) => b.active).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
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
              <div className={`text-sm font-bold ${totalPnl >= 0 ? "text-positive" : "text-negative"}`}>
                {formatPnl(totalPnl)}
              </div>
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
            { label: "Active Bots", value: activeBots.toString() },
            { label: "Total Trades", value: totalTrades.toString() },
            { label: "Win Rate", value: totalTrades > 0 ? `${winRate}%` : "—" },
            { label: "Total P&L", value: formatPnl(totalPnl) },
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Configure New Bot</h3>
                  <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-5">
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

                <button
                  onClick={handleCreate}
                  className="text-sm font-medium bg-foreground text-background px-6 py-2.5 rounded-full hover:bg-foreground/90 transition-all active:scale-95"
                >
                  Deploy Bot
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bot List */}
        <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border mb-8">
          <AnimatePresence>
            {bots.map((bot) => (
              <motion.div
                key={bot.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-4 bg-background hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <div className={`w-2 h-2 rounded-full ${bot.active ? "bg-positive" : "bg-border"}`} />
                      {bot.active && (
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-positive animate-ping opacity-40" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">{bot.pair}</span>
                    <span className="text-xs text-foreground bg-accent px-2 py-0.5 rounded-md">{bot.strategy}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">SL: {bot.sl}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">TP: {bot.tp}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Live price */}
                    <div className="text-right hidden md:block">
                      <div className="text-[10px] text-muted-foreground uppercase">Price</div>
                      <div className="text-xs font-mono text-foreground">{formatPrice(bot.currentPrice)}</div>
                    </div>
                    {/* Position indicator */}
                    <div className="text-right hidden sm:block min-w-[60px]">
                      <div className="text-[10px] text-muted-foreground uppercase">Position</div>
                      {bot.direction ? (
                        <div className={`text-xs font-semibold ${bot.direction === "LONG" ? "text-positive" : "text-negative"}`}>
                          {bot.direction}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">—</div>
                      )}
                    </div>
                    {/* Trades / Win */}
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-muted-foreground uppercase">W/T</div>
                      <div className="text-xs font-semibold text-foreground">
                        {bot.wins}/{bot.trades}
                      </div>
                    </div>
                    {/* P&L */}
                    <div className="text-right min-w-[70px]">
                      <div className="text-[10px] text-muted-foreground uppercase">P&L</div>
                      <div className={`text-sm font-semibold ${bot.pnl >= 0 ? "text-positive" : "text-negative"}`}>
                        {formatPnl(bot.pnl)}
                      </div>
                    </div>
                    {/* Controls */}
                    <div className="flex items-center gap-2">
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
                      <button
                        onClick={() => deleteBot(bot.id)}
                        className="p-2 rounded-full bg-secondary text-muted-foreground hover:text-negative hover:bg-negative/10 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {bots.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No bots yet. Create your first one above.
          </div>
        )}

        {/* Trade Log */}
        {tradeLog.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Live Trade Log</h2>
              <span className="text-xs text-muted-foreground">({tradeLog.length})</span>
            </div>
            <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border max-h-[320px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {tradeLog.map((trade) => {
                  const bot = bots.find((b) => b.id === trade.botId);
                  return (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-5 py-3 flex items-center justify-between gap-3 bg-background text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${trade.type === "LONG" ? "text-positive" : "text-negative"}`}>
                          {trade.type}
                        </span>
                        <span className="text-foreground font-medium">{bot?.pair || "—"}</span>
                        <span className="text-muted-foreground font-mono">@ {formatPrice(trade.entry)}</span>
                        {trade.exit && (
                          <>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-muted-foreground font-mono">{formatPrice(trade.exit)}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {trade.status === "open" ? (
                          <span className="text-muted-foreground flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                            Open
                          </span>
                        ) : (
                          <span className={`font-semibold ${(trade.pnl ?? 0) >= 0 ? "text-positive" : "text-negative"}`}>
                            {formatPnl(trade.pnl ?? 0)}
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
