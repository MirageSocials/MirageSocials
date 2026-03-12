import { useState, useEffect, useCallback, useRef } from "react";

export interface Trade {
  id: number;
  botId: number;
  type: "LONG" | "SHORT";
  entry: number;
  exit: number | null;
  pnl: number | null;
  status: "open" | "closed";
  timestamp: number;
}

export interface Bot {
  id: number;
  pair: string;
  strategy: string;
  sl: string;
  tp: string;
  active: boolean;
  pnl: number;
  trades: number;
  wins: number;
  currentPrice: number;
  entryPrice: number | null;
  direction: "LONG" | "SHORT" | null;
}

const basePrices: Record<string, number> = {
  "BTC/USDT": 67420,
  "ETH/USDT": 3580,
  "SOL/USDT": 148,
  "ARB/USDT": 1.12,
  "DOGE/USDT": 0.164,
  "AVAX/USDT": 35.8,
  "OP/USDT": 2.45,
  "MATIC/USDT": 0.72,
};

function getBasePrice(pair: string) {
  return basePrices[pair] || 100;
}

function jitter(price: number, volatility = 0.002) {
  return price * (1 + (Math.random() - 0.5) * 2 * volatility);
}

const initialBots: Bot[] = [
  { id: 1, pair: "BTC/USDT", strategy: "Scalp", sl: "2%", tp: "4%", active: true, pnl: 0, trades: 0, wins: 0, currentPrice: getBasePrice("BTC/USDT"), entryPrice: null, direction: null },
  { id: 2, pair: "ETH/USDT", strategy: "Swing", sl: "5%", tp: "12%", active: true, pnl: 0, trades: 0, wins: 0, currentPrice: getBasePrice("ETH/USDT"), entryPrice: null, direction: null },
  { id: 3, pair: "SOL/USDT", strategy: "Trend", sl: "3%", tp: "8%", active: false, pnl: 0, trades: 0, wins: 0, currentPrice: getBasePrice("SOL/USDT"), entryPrice: null, direction: null },
];

export function useBotSimulation() {
  const [bots, setBots] = useState<Bot[]>(initialBots);
  const [tradeLog, setTradeLog] = useState<Trade[]>([]);
  const tradeIdRef = useRef(1);

  const addTrade = useCallback((trade: Trade) => {
    setTradeLog((prev) => [trade, ...prev].slice(0, 50));
  }, []);

  // Simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setBots((prev) =>
        prev.map((bot) => {
          if (!bot.active) return bot;

          const newPrice = jitter(bot.currentPrice);
          const slPct = parseFloat(bot.sl) / 100;
          const tpPct = parseFloat(bot.tp) / 100;

          let updated = { ...bot, currentPrice: newPrice };

          // If no position, maybe open one
          if (!updated.entryPrice) {
            if (Math.random() < 0.08) {
              const dir = Math.random() > 0.45 ? "LONG" : "SHORT";
              updated.entryPrice = newPrice;
              updated.direction = dir;
              const trade: Trade = {
                id: tradeIdRef.current++,
                botId: bot.id,
                type: dir,
                entry: newPrice,
                exit: null,
                pnl: null,
                status: "open",
                timestamp: Date.now(),
              };
              addTrade(trade);
            }
            return updated;
          }

          // Check SL/TP
          const pctChange =
            updated.direction === "LONG"
              ? (newPrice - updated.entryPrice) / updated.entryPrice
              : (updated.entryPrice - newPrice) / updated.entryPrice;

          if (pctChange >= tpPct || pctChange <= -slPct) {
            const tradePnl = pctChange * 1000; // simulated $1000 position
            const win = pctChange > 0;
            updated.pnl += tradePnl;
            updated.trades += 1;
            updated.wins += win ? 1 : 0;

            const trade: Trade = {
              id: tradeIdRef.current++,
              botId: bot.id,
              type: updated.direction!,
              entry: updated.entryPrice,
              exit: newPrice,
              pnl: Math.round(tradePnl * 100) / 100,
              status: "closed",
              timestamp: Date.now(),
            };
            addTrade(trade);

            updated.entryPrice = null;
            updated.direction = null;
          }

          return updated;
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, [addTrade]);

  const toggleBot = useCallback((id: number) => {
    setBots((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, active: !b.active, entryPrice: null, direction: null } : b
      )
    );
  }, []);

  const createBot = useCallback((pair: string, strategy: string, sl: string, tp: string) => {
    const newBot: Bot = {
      id: Date.now(),
      pair,
      strategy,
      sl,
      tp,
      active: true,
      pnl: 0,
      trades: 0,
      wins: 0,
      currentPrice: getBasePrice(pair),
      entryPrice: null,
      direction: null,
    };
    setBots((prev) => [newBot, ...prev]);
  }, []);

  const deleteBot = useCallback((id: number) => {
    setBots((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const totalPnl = bots.reduce((sum, b) => sum + b.pnl, 0);
  const totalTrades = bots.reduce((sum, b) => sum + b.trades, 0);
  const totalWins = bots.reduce((sum, b) => sum + b.wins, 0);
  const winRate = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0;

  return { bots, tradeLog, toggleBot, createBot, deleteBot, totalPnl, totalTrades, winRate };
}
