import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Play, Pause, Plus, Trash2, Activity,
  Volume2, VolumeX, Wallet, ArrowDownToLine, ArrowUpFromLine,
  Bot, ChevronRight, Settings, TrendingUp, TrendingDown, Zap, LogOut,
  Shield, ExternalLink, AlertTriangle, Copy, Eye, EyeOff, RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBotSimulation } from "@/hooks/useBotSimulation";
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { playDepositSound, playWithdrawSound } from "@/lib/sounds";
import CandlestickChart from "@/components/CandlestickChart";
import EquityCurve from "@/components/EquityCurve";
import TradingViewWidget from "@/components/TradingViewWidget";

const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ARB/USDT", "DOGE/USDT", "AVAX/USDT", "OP/USDT", "MATIC/USDT"];
const strategies = ["Scalp", "Swing", "Trend", "News-Based"];

const livePairs = [
  { label: "SOL/USD", tv: "BINANCE:SOLUSDT", jup: "SOL" },
  { label: "BTC/USD", tv: "BINANCE:BTCUSDT", jup: "BTC" },
  { label: "ETH/USD", tv: "BINANCE:ETHUSDT", jup: "ETH" },
  { label: "BONK/USD", tv: "BINANCE:BONKUSDT", jup: "BONK" },
  { label: "WIF/USD", tv: "BYBIT:WIFUSDT", jup: "WIF" },
  { label: "JTO/USD", tv: "BYBIT:JTOUSDT", jup: "JTO" },
];

const formatPnl = (v: number) => `${v >= 0 ? "+" : ""}$${Math.abs(v).toFixed(2)}`;
const formatPrice = (p: number) => (p >= 1000 ? p.toFixed(2) : p >= 1 ? p.toFixed(3) : p.toFixed(5));

const strategyIcons: Record<string, string> = {
  Scalp: "⚡",
  Swing: "🔄",
  Trend: "📈",
  "News-Based": "📰",
};

const sentimentColors: Record<string, string> = {
  "Extremely Bullish": "text-positive",
  Bullish: "text-positive",
  Neutral: "text-muted-foreground",
  Bearish: "text-negative",
  "Extremely Bearish": "text-negative",
};

const sentimentBg: Record<string, string> = {
  "Extremely Bullish": "bg-positive/10 border-positive/20",
  Bullish: "bg-positive/5 border-positive/10",
  Neutral: "bg-secondary border-border",
  Bearish: "bg-negative/5 border-negative/10",
  "Extremely Bearish": "bg-negative/10 border-negative/20",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    bots, tradeLog, toggleBot, createBot, deleteBot,
    totalPnl, totalTrades, winRate,
    balance, balanceHistory, deposit, withdraw,
    soundEnabled, setSoundEnabled,
  } = useBotSimulation();
  const { signOut, user } = useAuth();

  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [selectedBotId, setSelectedBotId] = useState<number | null>(bots[0]?.id ?? null);
  const [showCreate, setShowCreate] = useState(false);
  const [showFunds, setShowFunds] = useState(false);
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [sl, setSl] = useState("2");
  const [tp, setTp] = useState("4");
  const [posSize, setPosSize] = useState("500");
  const [fundAmount, setFundAmount] = useState("");

  // Live trading state
  const [livePair, setLivePair] = useState(livePairs[0]);
  const [liveDirection, setLiveDirection] = useState<"LONG" | "SHORT">("LONG");
  const [liveSize, setLiveSize] = useState("100");
  const [liveLeverage, setLiveLeverage] = useState("5");
  const [walletGenerated, setWalletGenerated] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletSecret, setWalletSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [txHistory, setTxHistory] = useState<Array<{
    signature: string; type: "in" | "out"; amount: number; timestamp: number; otherAddress: string;
  }>>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [livePositions, setLivePositions] = useState<Array<{
    id: string; pair: string; direction: "LONG" | "SHORT";
    size: number; leverage: number; entry_price: number; created_at: string;
    wallet_address: string | null;
  }>>([]);

  // Load wallet from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("luna_live_wallet");
    if (saved) {
      try {
        const { address, secret } = JSON.parse(saved);
        setWalletAddress(address);
        setWalletSecret(secret);
        setWalletGenerated(true);
      } catch {}
    }
  }, []);

  // Fetch SOL balance
  const fetchSolBalance = useCallback(async () => {
    if (!walletAddress) return;
    setBalanceLoading(true);
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const pubkey = new PublicKey(walletAddress);
      const lamports = await connection.getBalance(pubkey);
      setSolBalance(lamports / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Failed to fetch SOL balance:", err);
      setSolBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  }, [walletAddress]);

  // Fetch transaction history
  const fetchTxHistory = useCallback(async () => {
    if (!walletAddress) return;
    setTxLoading(true);
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const pubkey = new PublicKey(walletAddress);
      const sigs = await connection.getSignaturesForAddress(pubkey, { limit: 20 });
      const txs: typeof txHistory = [];
      for (const sig of sigs) {
        try {
          const tx = await connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 });
          if (!tx?.meta || !tx.transaction) continue;
          const preBalances = tx.meta.preBalances;
          const postBalances = tx.meta.postBalances;
          const accounts = tx.transaction.message.accountKeys;
          const myIndex = accounts.findIndex(a => a.pubkey.toBase58() === walletAddress);
          if (myIndex === -1) continue;
          const diff = (postBalances[myIndex] - preBalances[myIndex]) / LAMPORTS_PER_SOL;
          const otherIndex = myIndex === 0 ? 1 : 0;
          const otherAddr = accounts[otherIndex]?.pubkey.toBase58() || "Unknown";
          txs.push({
            signature: sig.signature,
            type: diff >= 0 ? "in" : "out",
            amount: Math.abs(diff),
            timestamp: (sig.blockTime || 0) * 1000,
            otherAddress: otherAddr,
          });
        } catch {}
      }
      setTxHistory(txs);
    } catch (err) {
      console.error("Failed to fetch tx history:", err);
    } finally {
      setTxLoading(false);
    }
  }, [walletAddress]);

  // Withdraw SOL
  const handleWithdrawSol = useCallback(async () => {
    if (!walletAddress || !walletSecret || !withdrawAddress || !withdrawAmount) return;
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (solBalance !== null && amount > solBalance - 0.001) {
      toast.error("Insufficient balance (need ~0.001 SOL for fees)");
      return;
    }
    setWithdrawing(true);
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const secretBytes = new Uint8Array(
        walletSecret.match(/.{1,2}/g)!.map((b: string) => parseInt(b, 16))
      );
      const keypair = Keypair.fromSecretKey(secretBytes);
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: new PublicKey(withdrawAddress),
          lamports: Math.floor(amount * LAMPORTS_PER_SOL),
        })
      );
      const sig = await sendAndConfirmTransaction(connection, tx, [keypair]);
      toast.success(`Sent ${amount} SOL! Tx: ${sig.slice(0, 8)}...`);
      setWithdrawAmount("");
      setWithdrawAddress("");
      setShowWithdraw(false);
      fetchSolBalance();
      fetchTxHistory();
    } catch (err: any) {
      console.error("Withdraw failed:", err);
      toast.error(`Withdraw failed: ${err?.message || "Unknown error"}`);
    } finally {
      setWithdrawing(false);
    }
  }, [walletAddress, walletSecret, withdrawAddress, withdrawAmount, solBalance, fetchSolBalance, fetchTxHistory]);

  // Auto-fetch balance + tx history when wallet is generated
  useEffect(() => {
    if (walletGenerated && walletAddress) {
      fetchSolBalance();
      fetchTxHistory();
      const interval = setInterval(() => { fetchSolBalance(); fetchTxHistory(); }, 30000);
      return () => clearInterval(interval);
    }
  }, [walletGenerated, walletAddress, fetchSolBalance, fetchTxHistory]);

  // Load positions from database
  const loadPositions = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("live_positions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setLivePositions(data.map(p => ({
        id: p.id,
        pair: p.pair,
        direction: p.direction as "LONG" | "SHORT",
        size: Number(p.size),
        leverage: Number(p.leverage),
        entry_price: Number(p.entry_price),
        created_at: p.created_at,
        wallet_address: p.wallet_address,
      })));
    }
  }, [user]);

  useEffect(() => {
    if (user) loadPositions();
  }, [user, loadPositions]);

  const generateWallet = useCallback(() => {
    const keypair = Keypair.generate();
    const address = keypair.publicKey.toBase58();
    const secret = Array.from(keypair.secretKey).map(b => b.toString(16).padStart(2, '0')).join('');
    setWalletAddress(address);
    setWalletSecret(secret);
    setWalletGenerated(true);
    localStorage.setItem("luna_live_wallet", JSON.stringify({ address, secret }));
  }, []);

  const addPosition = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("live_positions")
      .insert({
        user_id: user.id,
        pair: livePair.label,
        direction: liveDirection,
        size: parseFloat(liveSize) || 100,
        leverage: parseFloat(liveLeverage) || 5,
        entry_price: 0,
        wallet_address: walletAddress || null,
      })
      .select()
      .single();
    if (!error && data) {
      setLivePositions(prev => [{
        id: data.id,
        pair: data.pair,
        direction: data.direction as "LONG" | "SHORT",
        size: Number(data.size),
        leverage: Number(data.leverage),
        entry_price: Number(data.entry_price),
        created_at: data.created_at,
        wallet_address: data.wallet_address,
      }, ...prev]);
    }
  }, [user, livePair, liveDirection, liveSize, liveLeverage, walletAddress]);

  const closePosition = useCallback(async (id: string) => {
    await supabase.from("live_positions").delete().eq("id", id);
    setLivePositions(prev => prev.filter(p => p.id !== id));
  }, []);
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
                luna<span className="text-muted-foreground font-normal"> agent</span>
              </span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={signOut}
              className="p-1.5 rounded-md text-muted-foreground hover:text-negative transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-background border border-border mb-3">
            <button
              onClick={() => setMode("demo")}
              className={`text-[10px] font-mono uppercase tracking-wider py-2 rounded-lg transition-all ${
                mode === "demo"
                  ? "bg-foreground text-background font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Demo
            </button>
            <button
              onClick={() => setMode("live")}
              className={`text-[10px] font-mono uppercase tracking-wider py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                mode === "live"
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="h-3 w-3" /> Live
            </button>
          </div>

          {/* Balance card - demo only */}
          {mode === "demo" && (
            <div className="rounded-xl bg-background border border-border p-3 mb-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Demo Balance</div>
              <div className="text-lg font-bold text-foreground font-mono">${balance.toFixed(2)}</div>
              <div className={`text-xs font-mono ${totalPnl >= 0 ? "text-positive" : "text-negative"}`}>
                {formatPnl(totalPnl)} all time
              </div>
            </div>
          )}

          {/* Wallet card - live only */}
          {mode === "live" && (
            <div className="rounded-xl bg-background border border-border p-3 mb-3">
              {walletGenerated ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Your Wallet</div>
                    <button
                      onClick={fetchSolBalance}
                      disabled={balanceLoading}
                      className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                      title="Refresh balance"
                    >
                      <RefreshCw className={`h-3 w-3 ${balanceLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  {/* SOL Balance */}
                  <div className="rounded-lg bg-secondary/40 p-2 mb-2">
                    <div className="text-[9px] font-mono text-muted-foreground uppercase">SOL Balance</div>
                    <div className="text-sm font-bold font-mono text-foreground">
                      {solBalance !== null ? `◎ ${solBalance.toFixed(4)}` : "Loading..."}
                    </div>
                    {solBalance !== null && solBalance === 0 && (
                      <div className="text-[8px] font-mono text-primary mt-0.5">
                        Send SOL to fund this wallet
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-positive" />
                    <span className="text-[10px] font-mono text-foreground">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(walletAddress)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy address"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-muted-foreground">Private Key:</span>
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showSecret ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                  </div>
                  {showSecret && (
                    <div className="mt-1 p-2 rounded-lg bg-secondary/50 break-all">
                      <span className="text-[8px] font-mono text-muted-foreground">{walletSecret.slice(0, 32)}...</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(walletSecret)}
                        className="ml-1 text-muted-foreground hover:text-foreground transition-colors inline"
                      >
                        <Copy className="h-2.5 w-2.5 inline" />
                      </button>
                    </div>
                  )}

                  {/* Withdraw Section */}
                  <div className="mt-2">
                    <button
                      onClick={() => setShowWithdraw(!showWithdraw)}
                      className="w-full text-[10px] font-mono uppercase tracking-wider text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors py-1"
                    >
                      <ArrowUpFromLine className="h-3 w-3" /> {showWithdraw ? "Hide Withdraw" : "Withdraw SOL"}
                    </button>
                    <AnimatePresence>
                      {showWithdraw && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="mt-2 space-y-2">
                            <input
                              type="text"
                              value={withdrawAddress}
                              onChange={(e) => setWithdrawAddress(e.target.value)}
                              placeholder="Recipient address"
                              className="w-full text-[10px] font-mono bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                            />
                            <input
                              type="number"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="Amount (SOL)"
                              className="w-full text-[10px] font-mono bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                              min="0.001" step="0.001"
                            />
                            {solBalance !== null && (
                              <button
                                onClick={() => setWithdrawAmount(Math.max(0, solBalance - 0.002).toFixed(6))}
                                className="text-[8px] font-mono text-primary hover:text-primary/80 transition-colors"
                              >
                                Max: {Math.max(0, solBalance - 0.002).toFixed(6)} SOL
                              </button>
                            )}
                            <button
                              onClick={handleWithdrawSol}
                              disabled={withdrawing || !withdrawAddress || !withdrawAmount}
                              className="w-full text-[10px] font-mono uppercase tracking-wider bg-negative text-background py-2 rounded-lg hover:bg-negative/90 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1"
                            >
                              {withdrawing ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <ArrowUpFromLine className="h-3 w-3" />
                              )}
                              {withdrawing ? "Sending..." : "Send SOL"}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <button
                  onClick={generateWallet}
                  className="w-full text-[10px] font-mono uppercase tracking-wider text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors py-1"
                >
                  <Zap className="h-3 w-3" /> Generate Solana Wallet
                </button>
              )}
            </div>
          )}

          {mode === "demo" && (
            <>
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
            </>
          )}

          {mode === "live" && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Trading Pair</span>
              <div className="space-y-1">
                {livePairs.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setLivePair(p)}
                    className={`w-full text-left text-[10px] font-mono px-3 py-2 rounded-lg border transition-all ${
                      livePair.label === p.label
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Agent Bot List - demo only */}
        {mode === "demo" && (
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
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-[10px] font-mono ${bot.pnl >= 0 ? "text-positive" : "text-negative"}`}>
                      {formatPnl(bot.pnl)}
                    </span>
                    <span className={`text-[8px] font-mono ${sentimentColors[bot.sentiment]}`}>
                      {bot.sentiment}
                    </span>
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
        )}

        {/* Live order panel in sidebar */}
        {mode === "live" && (
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* Direction */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setLiveDirection("LONG")}
                className={`py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  liveDirection === "LONG"
                    ? "bg-positive text-background font-bold"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingUp className="h-3 w-3" /> Long
              </button>
              <button
                onClick={() => setLiveDirection("SHORT")}
                className={`py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  liveDirection === "SHORT"
                    ? "bg-negative text-background font-bold"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingDown className="h-3 w-3" /> Short
              </button>
            </div>

            {/* Size */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">Size (USD)</label>
              <input
                type="number"
                value={liveSize}
                onChange={(e) => setLiveSize(e.target.value)}
                className="w-full text-xs font-mono bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                min="10" step="10"
              />
            </div>

            {/* Leverage */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
                Leverage: <span className="text-foreground">{liveLeverage}x</span>
              </label>
              <input
                type="range" min="1" max="100" value={liveLeverage}
                onChange={(e) => setLiveLeverage(e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1">
                <span>1x</span><span>25x</span><span>50x</span><span>100x</span>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-border bg-card p-3 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-muted-foreground">Direction</span>
                <span className={liveDirection === "LONG" ? "text-positive" : "text-negative"}>{liveDirection}</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-muted-foreground">Notional</span>
                <span className="text-foreground font-bold">${(parseFloat(liveSize || "0") * parseFloat(liveLeverage || "1")).toLocaleString()}</span>
              </div>
            </div>

            {/* Execute */}
            {walletGenerated ? (
              <button
                onClick={() => { addPosition(); window.open(`https://jup.ag/perps/${livePair.jup}`, "_blank"); }}
                className={`w-full py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 font-bold ${
                  liveDirection === "LONG"
                    ? "bg-positive text-background hover:bg-positive/90"
                    : "bg-negative text-background hover:bg-negative/90"
                }`}
              >
                <Zap className="h-3 w-3" /> {liveDirection} on Jupiter <ExternalLink className="h-2.5 w-2.5" />
              </button>
            ) : (
              <button
                onClick={generateWallet}
                className="w-full py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <Zap className="h-3 w-3" /> Generate Wallet First
              </button>
            )}

            <a
              href="https://jup.ag/perps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
            >
              <Shield className="h-3 w-3" /> Powered by Jupiter Perps <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        )}

        {/* Sidebar Stats - demo only */}
        {mode === "demo" && (
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
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Live Mode - TradingView + Positions */}
        {mode === "live" && (
          <div className="flex-1 flex flex-col">
            <div className="bg-negative/10 border-b border-negative/20 px-4 py-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-negative shrink-0" />
                <span className="text-[10px] font-mono text-negative">
                  REAL MONEY — You are trading with real funds on Jupiter Perps. Trade responsibly.
                </span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <TradingViewWidget symbol={livePair.tv} height={420} />

              {/* Positions Tracker */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Open Positions</span>
                  <span className="text-[10px] font-mono text-muted-foreground">({livePositions.length})</span>
                </div>

                {livePositions.length > 0 ? (
                  <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                    <AnimatePresence initial={false}>
                      {livePositions.map((pos) => (
                        <motion.div
                          key={pos.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 py-3 flex items-center justify-between bg-background"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              pos.direction === "LONG" ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
                            }`}>
                              {pos.direction}
                            </span>
                            <span className="text-xs font-mono font-semibold text-foreground">{pos.pair}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">${pos.size} × {pos.leverage}x</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {new Date(pos.created_at).toLocaleTimeString()}
                            </span>
                            <button
                              onClick={() => closePosition(pos.id)}
                              className="text-[9px] font-mono text-negative hover:text-negative/80 transition-colors px-2 py-1 rounded border border-negative/20 hover:bg-negative/10"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border p-6 text-center text-xs text-muted-foreground font-mono">
                    No open positions — place a trade via Jupiter Perps
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode - Existing bot UI */}
        {mode === "demo" && (
          <>
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{selectedBot.strategy}</span>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${selectedBot.active ? "bg-positive" : "bg-border"}`} />
                            <span className={`text-[10px] font-mono ${selectedBot.active ? "text-positive" : "text-muted-foreground"}`}>
                              {selectedBot.active ? "RUNNING" : "PAUSED"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] font-mono text-muted-foreground">◎ Wallet:</span>
                          <span className="text-[9px] font-mono text-primary">
                            {selectedBot.walletAddress.slice(0, 6)}...{selectedBot.walletAddress.slice(-4)}
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(selectedBot.walletAddress)}
                            className="text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                            title="Copy full address"
                          >
                            [copy]
                          </button>
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

                  {/* Sentiment Card */}
                  <div className={`rounded-xl border p-3 mb-4 ${sentimentBg[selectedBot.sentiment]}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Agent Sentiment</div>
                        <div className={`text-sm font-bold font-mono mt-0.5 ${sentimentColors[selectedBot.sentiment]}`}>
                          {selectedBot.sentiment}
                          <span className="text-[10px] font-normal ml-2">
                            ({selectedBot.sentimentScore > 0 ? "+" : ""}{selectedBot.sentimentScore})
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-muted-foreground mt-1">
                          "{selectedBot.sentimentReason}"
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-mono text-muted-foreground">Bias</div>
                        <div className={`text-xs font-bold font-mono ${selectedBot.sentimentScore >= 0 ? "text-positive" : "text-negative"}`}>
                          {selectedBot.sentimentScore >= 50 ? "STRONG LONG" :
                           selectedBot.sentimentScore >= 15 ? "LONG" :
                           selectedBot.sentimentScore >= -15 ? "NEUTRAL" :
                           selectedBot.sentimentScore >= -50 ? "SHORT" : "STRONG SHORT"}
                        </div>
                      </div>
                    </div>
                    {/* Sentiment bar */}
                    <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${selectedBot.sentimentScore >= 0 ? "bg-positive" : "bg-negative"}`}
                        style={{ width: `${Math.abs(selectedBot.sentimentScore)}%`, marginLeft: selectedBot.sentimentScore >= 0 ? "50%" : `${50 - Math.abs(selectedBot.sentimentScore)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1">
                      <span>Bearish</span><span>Neutral</span><span>Bullish</span>
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

                  {/* Equity Curve */}
                  <div className="mb-6">
                    <EquityCurve balanceHistory={balanceHistory} />
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
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
