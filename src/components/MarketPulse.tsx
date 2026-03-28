import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Flame, Zap, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";

const COINS = [
  { id: "bitcoin", symbol: "BTC", tradePair: "BTC/USD" },
  { id: "ethereum", symbol: "ETH", tradePair: "ETH/USD" },
  { id: "solana", symbol: "SOL", tradePair: "SOL/USD" },
  { id: "bonk", symbol: "BONK", tradePair: "BONK/USD" },
];

interface CoinData {
  symbol: string;
  tradePair: string;
  price: number;
  change24h: number;
}

const MarketPulse = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fearGreed, setFearGreed] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = COINS.map((c) => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await res.json();
        const mapped = COINS.map((c) => ({
          symbol: c.symbol,
          tradePair: c.tradePair,
          price: data[c.id]?.usd ?? 0,
          change24h: data[c.id]?.usd_24h_change ?? 0,
        }));
        setCoins(mapped);
      } catch {
        // Fallback static data if API fails
        setCoins(COINS.map((c) => ({ symbol: c.symbol, tradePair: c.tradePair, price: 0, change24h: 0 })));
      }
      setLoading(false);
    };

    const fetchFearGreed = async () => {
      try {
        const res = await fetch("https://api.alternative.me/fng/?limit=1");
        const data = await res.json();
        setFearGreed(parseInt(data.data?.[0]?.value ?? "50"));
      } catch {
        setFearGreed(72);
      }
    };

    fetchPrices();
    fetchFearGreed();

    const interval = setInterval(fetchPrices, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const getFearLabel = (val: number) => {
    if (val >= 75) return "Extreme Greed";
    if (val >= 55) return "Greed";
    if (val >= 45) return "Neutral";
    if (val >= 25) return "Fear";
    return "Extreme Fear";
  };

  const isBullish = fearGreed !== null && fearGreed >= 50;

  const handleCoinClick = (tradePair: string) => {
    const pairParam = encodeURIComponent(tradePair);
    navigate(`/trade?pair=${pairParam}`);
  };

  return (
    <div className={`mx-3 mt-3 mb-1 rounded-xl border p-3 overflow-hidden transition-colors ${
      isBullish
        ? "border-positive/20 bg-gradient-to-r from-positive/5 via-background to-primary/5"
        : "border-negative/20 bg-gradient-to-r from-negative/5 via-background to-muted/5"
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${
          isBullish ? "bg-positive/15 text-positive" : "bg-negative/15 text-negative"
        }`}>
          <TrendingUp className="h-3 w-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isBullish ? "Bullish" : "Bearish"}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">Market Pulse</span>
        {fearGreed !== null && (
          <div className="ml-auto flex items-center gap-1 text-[10px] font-mono">
            <Flame className="h-3 w-3 text-orange-400" />
            <span className="text-muted-foreground hidden sm:inline">Fear & Greed:</span>
            <span className={`font-bold ${isBullish ? "text-positive" : "text-negative"}`}>{fearGreed}</span>
            <span className={`text-[9px] hidden sm:inline ${isBullish ? "text-positive" : "text-negative"}`}>
              {getFearLabel(fearGreed)}
            </span>
          </div>
        )}
      </div>

      {/* Coins */}
      {loading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {coins.map((coin) => {
            const isUp = coin.change24h >= 0;
            return (
              <button
                key={coin.symbol}
                onClick={() => handleCoinClick(coin.tradePair)}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/60 border border-border/50 hover:border-primary/40 hover:bg-card transition-all group cursor-pointer text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors">
                    {coin.symbol}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {coin.price > 0
                      ? `$${coin.price >= 1000
                          ? coin.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
                          : coin.price < 0.01
                          ? coin.price.toFixed(6)
                          : coin.price < 1
                          ? coin.price.toFixed(4)
                          : coin.price.toFixed(2)}`
                      : "—"}
                  </span>
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${
                  isUp ? "text-positive" : "text-negative"
                }`}>
                  {isUp ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                  {isUp ? "+" : ""}{coin.change24h.toFixed(2)}%
                </div>
              </button>
            );
          })}

          {/* Volume pill */}
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Zap className="h-3 w-3 text-primary" />
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase">Live</span>
              <span className="text-[10px] font-mono font-bold text-foreground">CoinGecko</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPulse;
