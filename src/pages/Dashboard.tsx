import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Play, Pause, Plus, Trash2, Activity,
  Volume2, VolumeX, Wallet, ArrowDownToLine, ArrowUpFromLine,
  Bot, ChevronRight, Settings, TrendingUp, TrendingDown, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBotSimulation } from "@/hooks/useBotSimulation";
import { playDepositSound, playWithdrawSound } from "@/lib/sounds";
import CandlestickChart from "@/components/CandlestickChart";

const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ARB/USDT", "DOGE/USDT", "AVAX/USDT", "OP/USDT", "MATIC/USDT"];
const strategies = ["Scalp", "Swing", "Trend", "News-Based"];

const formatPnl = (v: number) => `${v >= 0 ? "+" : ""}$${Math.abs(v).toFixed(2)}`;
const formatPrice = (p: number) => (p >= 1000 ? p.toFixed(2) : p >= 1 ? p.toFixed(3) : p.toFixed(5));

const strategyIcons: Record<string, string> = {
  Scalp: "⚡",
  Swing: "🔄",
  Trend: "📈",
  "News-Based": "📰",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    bots, tradeLog, toggleBot, createBot, deleteBot,
    totalPnl, totalTrades, winRate,
    balance, deposit, withdraw,
    soundEnabled, setSoundEnabled,
  } = useBotSimulation();

  const [selectedBotId, setSelectedBotId] = useState<number | null>(bots[0]?.id ?? null);
  const [showCreate, setShowCreate] = useState(false);
  const [showFunds, setShowFunds] = useState(false);
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [sl, setSl] = useState("2");
  const [tp, setTp] = useState("4");
  const [posSize, setPosSize] = useState("500");
  const [fundAmount, setFundAmount] = useState("");

  const selectedBot = bots.find((b) => b.id === selectedBotId) || null;
  const botTrades = tradeLog.filter((t) => t.botId === selectedBotId);

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
    if (amt > 0) { deposit(amt); playDepositSound(); setFundAmount(""); }
  };

  const handleWithdraw = () => {
    const amt = parseFloat(fundAmount);
    if (amt > 0 && amt <= balance) { withdraw(amt); playWithdrawSound(); setFundAmount(""); }
  };

  // Auto-select first bot if current is deleted
  if (!selectedBot && bots.length > 0 && selectedBotId !== null) {
    setSelectedBotId(bots[0].id);
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-secondary/20 flex flex-col h-screen sticky top-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-bold tracking-tight font-mono uppercase text-foreground">
                perp<span className="text-muted-foreground font-normal">bot</span>
              </span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Balance card */}
          <div className="rounded-xl bg-background border border-border p-3 mb-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Balance</div>
            <div className="text-lg font-bold text-foreground font-mono">${balance.toFixed(2)}</div>
            <div className={`text-xs font-mono ${totalPnl >= 0 ? "text-positive" : "text-negative"}`}>
              {formatPnl(totalPnl)} all time
            </div>
          </div>

          <button
            onClick={() => setShowFunds(!showFunds)}
            className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors font-mono uppercase tracking-wider"
          >
            <Wallet className="h-3 w-3" />
            Manage Funds
          </button>

          <AnimatePresence>
            {showFunds && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-3 space-y-2">
                  <input
                    type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full text-xs bg-background border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleDeposit}
                      className="flex-1 text-[10px] font-mono uppercase tracking-wider bg-foreground text-background py-2 rounded-lg hover:bg-foreground/90 transition-all active:scale-95 flex items-center justify-center gap-1">
                      <ArrowDownToLine className="h-3 w-3" /> Deposit
                    </button>
                    <button onClick={handleWithdraw}
                      disabled={parseFloat(fundAmount) > balance}
                      className="flex-1 text-[10px] font-mono uppercase tracking-wider border border-border text-foreground py-2 rounded-lg hover:bg-accent transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1">
                      <ArrowUpFromLine className="h-3 w-3" /> Withdraw
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agent Bot List */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Agent Bots</span>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="p-1.5 rounded-md bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-1.5">
            {bots.map((bot) => (
              <button
                key={bot.id}
                onClick={() => setSelectedBotId(bot.id)}
                className={`w-full text-left rounded-xl p-3 transition-all ${
                  selectedBotId === bot.id
                    ? "bg-background border border-border shadow-sm"
                    : "hover:bg-background/60 border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{strategyIcons[bot.strategy] || "🤖"}</span>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{bot.pair}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{bot.strategy}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className={`w-1.5 h-1.5 rounded-full ${bot.active ? "bg-positive" : "bg-border"}`} />
                      {bot.active && <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-positive animate-ping opacity-40" />}
                    </div>
                    {selectedBotId === bot.id && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                  </div>
                </div>
                <div className={`text-[10px] font-mono mt-1 ${bot.pnl >= 0 ? "text-positive" : "text-negative"}`}>
                  {formatPnl(bot.pnl)}
                </div>
              </button>
            ))}
          </div>

          {bots.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-xs font-mono">
              No agents yet
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="p-4 border-t border-border">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Bots", value: bots.filter((b) => b.active).length.toString() },
              { label: "Trades", value: totalTrades.toString() },
              { label: "Win %", value: totalTrades > 0 ? `${winRate}%` : "—" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[9px] text-muted-foreground uppercase font-mono tracking-wider">{s.label}</div>
                <div className="text-xs font-bold text-foreground font-mono">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Create Bot Panel */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-b border-border"
            >
              <div className="p-6 bg-secondary/30">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Deploy New Agent</h3>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Trading Pair</label>
                      <div className="flex flex-wrap gap-1.5">
                        {pairs.map((p) => (
                          <button key={p} onClick={() => setSelectedPair(p)}
                            className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg border transition-all ${
                              selectedPair === p
                                ? "bg-foreground text-background border-foreground"
                                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                            }`}>{p}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Strategy</label>
                      <div className="flex flex-wrap gap-1.5">
                        {strategies.map((s) => (
                          <button key={s} onClick={() => setSelectedStrategy(s)}
                            className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg border transition-all ${
                              selectedStrategy === s
                                ? "bg-foreground text-background border-foreground"
                                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                            }`}>{strategyIcons[s]} {s}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Stop Loss %</label>
                      <input type="number" value={sl} onChange={(e) => setSl(e.target.value)}
                        className="w-full text-xs font-mono bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20" min="0.1" step="0.1" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Take Profit %</label>
                      <input type="number" value={tp} onChange={(e) => setTp(e.target.value)}
                        className="w-full text-xs font-mono bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20" min="0.1" step="0.1" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Position $</label>
                      <input type="number" value={posSize} onChange={(e) => setPosSize(e.target.value)}
                        className="w-full text-xs font-mono bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20" min="10" step="50" />
                    </div>
                  </div>

                  {parseFloat(posSize) > balance && (
                    <p className="text-[10px] font-mono text-negative mb-3">Insufficient balance</p>
                  )}

                  <div className="flex gap-3">
                    <button onClick={handleCreate} disabled={parseFloat(posSize) > balance}
                      className="text-[10px] font-mono uppercase tracking-widest bg-foreground text-background px-6 py-2.5 rounded-lg hover:bg-foreground/90 transition-all active:scale-95 disabled:opacity-40 flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Deploy Agent
                    </button>
                    <button onClick={() => setShowCreate(false)}
                      className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Bot View */}
        {selectedBot ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              {/* Bot Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{strategyIcons[selectedBot.strategy] || "🤖"}</span>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">{selectedBot.pair} <span className="text-muted-foreground font-normal">Agent</span></h1>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{selectedBot.strategy}</span>
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedBot.active ? "bg-positive" : "bg-border"}`} />
                        <span className={`text-[10px] font-mono ${selectedBot.active ? "text-positive" : "text-muted-foreground"}`}>
                          {selectedBot.active ? "RUNNING" : "PAUSED"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleBot(selectedBot.id)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${
                      selectedBot.active
                        ? "bg-foreground text-background hover:bg-foreground/80"
                        : "bg-secondary text-muted-foreground hover:bg-accent"
                    }`}>
                    {selectedBot.active ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Start</>}
                  </button>
                  <button onClick={() => { deleteBot(selectedBot.id); setSelectedBotId(bots[0]?.id ?? null); }}
                    className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-negative hover:bg-negative/10 transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {[
                  { label: "P&L", value: formatPnl(selectedBot.pnl), color: selectedBot.pnl >= 0 ? "text-positive" : "text-negative" },
                  { label: "Trades", value: selectedBot.trades.toString(), color: "text-foreground" },
                  { label: "Win Rate", value: selectedBot.trades > 0 ? `${Math.round((selectedBot.wins / selectedBot.trades) * 100)}%` : "—", color: "text-foreground" },
                  { label: "Position", value: `$${selectedBot.positionSize}`, color: "text-foreground" },
                  { label: "SL / TP", value: `${selectedBot.sl} / ${selectedBot.tp}`, color: "text-foreground" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border p-3 bg-background">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{s.label}</div>
                    <div className={`text-sm font-bold font-mono mt-0.5 ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Live Price + Chart */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Live Chart</span>
                    <span className="text-sm font-mono font-bold text-foreground">{formatPrice(selectedBot.currentPrice)}</span>
                  </div>
                  {selectedBot.direction && (
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${
                        selectedBot.direction === "LONG" ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
                      }`}>
                        {selectedBot.direction} @ {formatPrice(selectedBot.entryPrice!)}
                      </span>
                      {(() => {
                        const pct = selectedBot.direction === "LONG"
                          ? (selectedBot.currentPrice - selectedBot.entryPrice!) / selectedBot.entryPrice!
                          : (selectedBot.entryPrice! - selectedBot.currentPrice) / selectedBot.entryPrice!;
                        const uPnl = pct * selectedBot.positionSize;
                        return (
                          <span className={`text-[10px] font-mono font-bold ${uPnl >= 0 ? "text-positive" : "text-negative"}`}>
                            {formatPnl(uPnl)}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <CandlestickChart candles={selectedBot.candles} pair={selectedBot.pair} height={200} />
              </div>

              {/* Trade Log for this bot */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Trade History</span>
                  <span className="text-[10px] font-mono text-muted-foreground">({botTrades.length})</span>
                </div>

                {botTrades.length > 0 ? (
                  <div className="rounded-xl border border-border overflow-hidden divide-y divide-border max-h-[280px] overflow-y-auto">
                    <AnimatePresence initial={false}>
                      {botTrades.map((trade) => (
                        <motion.div
                          key={trade.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="px-4 py-2.5 flex items-center justify-between gap-3 bg-background text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`font-bold font-mono text-[10px] px-1.5 py-0.5 rounded ${
                              trade.type === "LONG" ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
                            }`}>
                              {trade.type}
                            </span>
                            <span className="text-muted-foreground font-mono text-[10px]">@ {formatPrice(trade.entry)}</span>
                            {trade.exit && (
                              <>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-muted-foreground font-mono text-[10px]">{formatPrice(trade.exit)}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {trade.status === "open" ? (
                              <span className="text-muted-foreground flex items-center gap-1 font-mono text-[10px]">
                                <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                                OPEN
                              </span>
                            ) : (
                              <span className={`font-bold font-mono text-[10px] ${(trade.pnl ?? 0) >= 0 ? "text-positive" : "text-negative"}`}>
                                {formatPnl(trade.pnl ?? 0)}
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {new Date(trade.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border p-8 text-center text-xs text-muted-foreground font-mono">
                    Waiting for trades…
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* No bot selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bot className="h-12 w-12 text-border mx-auto mb-4" />
              <h2 className="text-sm font-semibold text-foreground mb-1">No Agent Selected</h2>
              <p className="text-xs text-muted-foreground font-mono mb-4">
                Choose an agent from the sidebar or deploy a new one
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="text-[10px] font-mono uppercase tracking-widest bg-foreground text-background px-5 py-2.5 rounded-lg hover:bg-foreground/90 transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <Plus className="h-3 w-3" /> Deploy Agent
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
