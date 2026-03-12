import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Play, Pause, Plus, TrendingUp, TrendingDown,
  Trash2, Activity, X, Volume2, VolumeX, Wallet,
  ArrowDownToLine, ArrowUpFromLine, ChevronDown, ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBotSimulation } from "@/hooks/useBotSimulation";
import { playDepositSound, playWithdrawSound } from "@/lib/sounds";
import CandlestickChart from "@/components/CandlestickChart";

const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ARB/USDT", "DOGE/USDT", "AVAX/USDT", "OP/USDT", "MATIC/USDT"];
const strategies = ["Scalp", "Swing", "Trend", "News-Based"];

const formatPnl = (v: number) => `${v >= 0 ? "+" : ""}$${Math.abs(v).toFixed(2)}`;
const formatPrice = (p: number) => (p >= 1000 ? p.toFixed(2) : p >= 1 ? p.toFixed(3) : p.toFixed(5));

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    bots, tradeLog, toggleBot, createBot, deleteBot,
    totalPnl, totalTrades, winRate,
    balance, deposit, withdraw,
    soundEnabled, setSoundEnabled,
  } = useBotSimulation();

  const [showCreate, setShowCreate] = useState(false);
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [sl, setSl] = useState("2");
  const [tp, setTp] = useState("4");
  const [posSize, setPosSize] = useState("500");
  const [expandedBot, setExpandedBot] = useState<number | null>(null);

  // Fund management
  const [showFunds, setShowFunds] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const handleCreate = () => {
    const size = parseFloat(posSize) || 500;
    if (size > balance) return;
    createBot(selectedPair, selectedStrategy, `${sl}%`, `${tp}%`, size);
    setShowCreate(false);
    setSl("2");
    setTp("4");
    setPosSize("500");
  };

  const handleDeposit = () => {
    const amt = parseFloat(fundAmount);
    if (amt > 0) {
      deposit(amt);
      playDepositSound();
      setFundAmount("");
    }
  };

  const handleWithdraw = () => {
    const amt = parseFloat(fundAmount);
    if (amt > 0 && amt <= balance) {
      withdraw(amt);
      playWithdrawSound();
      setFundAmount("");
    }
  };

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-muted-foreground uppercase">Balance</div>
              <div className="text-sm font-bold text-foreground">${balance.toFixed(2)}</div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-muted-foreground uppercase">P&L</div>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Balance", value: `$${balance.toFixed(2)}` },
            { label: "Active Bots", value: bots.filter((b) => b.active).length.toString() },
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

        {/* Fund Management */}
        <div className="mb-6">
          <button
            onClick={() => setShowFunds(!showFunds)}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <Wallet className="h-4 w-4" />
            Manage Funds
            {showFunds ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <AnimatePresence>
            {showFunds && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-border p-5 bg-secondary/50 flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[180px]">
                    <label className="text-xs text-muted-foreground block mb-2">Amount (USD)</label>
                    <input
                      type="number"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      placeholder="1000"
                      className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      min="0"
                      step="100"
                    />
                  </div>
                  <button
                    onClick={handleDeposit}
                    className="inline-flex items-center gap-2 text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-foreground/90 transition-all active:scale-95"
                  >
                    <ArrowDownToLine className="h-3.5 w-3.5" />
                    Deposit
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={parseFloat(fundAmount) > balance}
                    className="inline-flex items-center gap-2 text-sm font-medium border border-border text-foreground px-5 py-2.5 rounded-full hover:bg-accent transition-all active:scale-95 disabled:opacity-40"
                  >
                    <ArrowUpFromLine className="h-3.5 w-3.5" />
                    Withdraw
                  </button>
                  <span className="text-xs text-muted-foreground">
                    Available: <span className="font-semibold text-foreground">${balance.toFixed(2)}</span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Stop Loss (%)</label>
                    <input type="number" value={sl} onChange={(e) => setSl(e.target.value)}
                      className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      min="0.1" step="0.1" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Take Profit (%)</label>
                    <input type="number" value={tp} onChange={(e) => setTp(e.target.value)}
                      className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      min="0.1" step="0.1" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Position Size ($)</label>
                    <input type="number" value={posSize} onChange={(e) => setPosSize(e.target.value)}
                      className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      min="10" step="50" />
                  </div>
                </div>

                {parseFloat(posSize) > balance && (
                  <p className="text-xs text-negative mb-3">Insufficient balance. Deposit funds first.</p>
                )}

                <button
                  onClick={handleCreate}
                  disabled={parseFloat(posSize) > balance}
                  className="text-sm font-medium bg-foreground text-background px-6 py-2.5 rounded-full hover:bg-foreground/90 transition-all active:scale-95 disabled:opacity-40"
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
                className="bg-background"
              >
                <div
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedBot(expandedBot === bot.id ? null : bot.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <div className={`w-2 h-2 rounded-full ${bot.active ? "bg-positive" : "bg-border"}`} />
                      {bot.active && <div className="absolute inset-0 w-2 h-2 rounded-full bg-positive animate-ping opacity-40" />}
                    </div>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">{bot.pair}</span>
                    <span className="text-xs text-foreground bg-accent px-2 py-0.5 rounded-md">{bot.strategy}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">${bot.positionSize}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <div className="text-[10px] text-muted-foreground uppercase">Price</div>
                      <div className="text-xs font-mono text-foreground">{formatPrice(bot.currentPrice)}</div>
                    </div>
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
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-muted-foreground uppercase">W/T</div>
                      <div className="text-xs font-semibold text-foreground">{bot.wins}/{bot.trades}</div>
                    </div>
                    <div className="text-right min-w-[70px]">
                      <div className="text-[10px] text-muted-foreground uppercase">P&L</div>
                      <div className={`text-sm font-semibold ${bot.pnl >= 0 ? "text-positive" : "text-negative"}`}>
                        {formatPnl(bot.pnl)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleBot(bot.id)}
                        className={`p-2 rounded-full transition-all ${bot.active ? "bg-foreground text-background hover:bg-foreground/80" : "bg-secondary text-muted-foreground hover:bg-accent"}`}>
                        {bot.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => deleteBot(bot.id)}
                        className="p-2 rounded-full bg-secondary text-muted-foreground hover:text-negative hover:bg-negative/10 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded chart */}
                <AnimatePresence>
                  {expandedBot === bot.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden px-6 pb-4"
                    >
                      <div className="grid sm:grid-cols-4 gap-3 mb-3">
                        <div className="rounded-lg bg-secondary/50 p-3">
                          <div className="text-[10px] text-muted-foreground uppercase">SL / TP</div>
                          <div className="text-sm font-semibold text-foreground">{bot.sl} / {bot.tp}</div>
                        </div>
                        <div className="rounded-lg bg-secondary/50 p-3">
                          <div className="text-[10px] text-muted-foreground uppercase">Position Size</div>
                          <div className="text-sm font-semibold text-foreground">${bot.positionSize}</div>
                        </div>
                        <div className="rounded-lg bg-secondary/50 p-3">
                          <div className="text-[10px] text-muted-foreground uppercase">Entry</div>
                          <div className="text-sm font-mono font-semibold text-foreground">
                            {bot.entryPrice ? formatPrice(bot.entryPrice) : "—"}
                          </div>
                        </div>
                        <div className="rounded-lg bg-secondary/50 p-3">
                          <div className="text-[10px] text-muted-foreground uppercase">Unrealized</div>
                          {bot.entryPrice && bot.direction ? (
                            (() => {
                              const pct = bot.direction === "LONG"
                                ? (bot.currentPrice - bot.entryPrice) / bot.entryPrice
                                : (bot.entryPrice - bot.currentPrice) / bot.entryPrice;
                              const uPnl = pct * bot.positionSize;
                              return (
                                <div className={`text-sm font-semibold ${uPnl >= 0 ? "text-positive" : "text-negative"}`}>
                                  {formatPnl(uPnl)}
                                </div>
                              );
                            })()
                          ) : (
                            <div className="text-sm text-muted-foreground">—</div>
                          )}
                        </div>
                      </div>
                      <CandlestickChart candles={bot.candles} pair={bot.pair} height={140} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {bots.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No bots yet. Deposit funds and create your first one above.
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
                        <span className="text-muted-foreground hidden sm:inline">${trade.positionSize}</span>
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
