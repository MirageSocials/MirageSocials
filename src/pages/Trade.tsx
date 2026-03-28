import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Wallet, TrendingUp, TrendingDown,
  Zap, Shield, LogOut, ExternalLink, AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import TradingViewWidget from "@/components/TradingViewWidget";

const tradingPairs = [
  { label: "SOL/USD", tv: "BINANCE:SOLUSDT", jup: "SOL" },
  { label: "BTC/USD", tv: "BINANCE:BTCUSDT", jup: "BTC" },
  { label: "ETH/USD", tv: "BINANCE:ETHUSDT", jup: "ETH" },
  { label: "BONK/USD", tv: "BINANCE:BONKUSDT", jup: "BONK" },
  { label: "WIF/USD", tv: "BYBIT:WIFUSDT", jup: "WIF" },
  { label: "JTO/USD", tv: "BYBIT:JTOUSDT", jup: "JTO" },
];

const Trade = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [selectedPair, setSelectedPair] = useState(tradingPairs[0]);
  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");
  const [size, setSize] = useState("100");
  const [leverage, setLeverage] = useState("5");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showRiskWarning, setShowRiskWarning] = useState(true);

  const connectWallet = useCallback(async () => {
    try {
      const solana = (window as any).solana;
      if (!solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        return;
      }
      const resp = await solana.connect();
      setWalletAddress(resp.publicKey.toString());
      setWalletConnected(true);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    try {
      const solana = (window as any).solana;
      solana?.disconnect();
    } catch {}
    setWalletConnected(false);
    setWalletAddress("");
  }, []);

  const openJupiterPerps = () => {
    const url = `https://jup.ag/perps/${selectedPair.jup}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Risk Warning Banner */}
      <AnimatePresence>
        {showRiskWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-negative/10 border-b border-negative/20"
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-negative shrink-0" />
                <span className="text-[10px] font-mono text-negative">
                  REAL MONEY TRADING — You are trading with real funds on Jupiter Perps. Trade responsibly.
                </span>
              </div>
              <button
                onClick={() => setShowRiskWarning(false)}
                className="text-[10px] font-mono text-negative/60 hover:text-negative transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold tracking-tight font-mono uppercase text-foreground">
              luna<span className="text-muted-foreground font-normal"> live</span>
            </span>
            <div className="hidden md:flex items-center gap-1.5 ml-4">
              {tradingPairs.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setSelectedPair(p)}
                  className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg border transition-all ${
                    selectedPair.label === p.label
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-foreground/30"
            >
              Demo Mode
            </button>
            {walletConnected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-positive/10 border border-positive/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-positive" />
                  <span className="text-[10px] font-mono text-positive">
                    {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-[10px] font-mono text-muted-foreground hover:text-negative transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="text-[10px] font-mono uppercase tracking-widest bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
              >
                <Wallet className="h-3 w-3" /> Connect Wallet
              </button>
            )}
            <button
              onClick={signOut}
              className="p-1.5 rounded-md text-muted-foreground hover:text-negative transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile pair selector */}
      <div className="md:hidden flex items-center gap-1.5 px-4 py-2 border-b border-border overflow-x-auto">
        {tradingPairs.map((p) => (
          <button
            key={p.label}
            onClick={() => setSelectedPair(p)}
            className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
              selectedPair.label === p.label
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Chart Area */}
        <div className="flex-1 p-4">
          <TradingViewWidget symbol={selectedPair.tv} height={500} />
        </div>

        {/* Order Panel */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border p-4 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Trade {selectedPair.label}</span>
          </div>

          {/* Direction */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDirection("LONG")}
              className={`py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                direction === "LONG"
                  ? "bg-positive text-background font-bold"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" /> Long
            </button>
            <button
              onClick={() => setDirection("SHORT")}
              className={`py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                direction === "SHORT"
                  ? "bg-negative text-background font-bold"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingDown className="h-3.5 w-3.5" /> Short
            </button>
          </div>

          {/* Size */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Position Size (USD)</label>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full text-sm font-mono bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              min="10"
              step="10"
            />
          </div>

          {/* Leverage */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">
              Leverage: <span className="text-foreground">{leverage}x</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-1">
              <span>1x</span>
              <span>25x</span>
              <span>50x</span>
              <span>100x</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-border bg-card p-3 space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-muted-foreground">Direction</span>
              <span className={direction === "LONG" ? "text-positive" : "text-negative"}>{direction}</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-muted-foreground">Size</span>
              <span className="text-foreground">${size}</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-muted-foreground">Leverage</span>
              <span className="text-foreground">{leverage}x</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono border-t border-border pt-2">
              <span className="text-muted-foreground">Notional</span>
              <span className="text-foreground font-bold">${(parseFloat(size || "0") * parseFloat(leverage || "1")).toLocaleString()}</span>
            </div>
          </div>

          {/* Execute via Jupiter */}
          {walletConnected ? (
            <button
              onClick={openJupiterPerps}
              className={`w-full py-3.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-bold ${
                direction === "LONG"
                  ? "bg-positive text-background hover:bg-positive/90"
                  : "bg-negative text-background hover:bg-negative/90"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              Open {direction} on Jupiter
              <ExternalLink className="h-3 w-3" />
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="w-full py-3.5 rounded-xl text-xs font-mono uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Wallet className="h-3.5 w-3.5" /> Connect Wallet to Trade
            </button>
          )}

          {/* Jupiter link */}
          <div className="text-center">
            <a
              href="https://jup.ag/perps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <Shield className="h-3 w-3" /> Powered by Jupiter Perps
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Trade;
