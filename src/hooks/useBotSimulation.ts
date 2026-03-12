import { useState, useEffect, useCallback, useRef } from "react";
import { playWinSound, playLossSound, playOpenSound } from "@/lib/sounds";

export interface Trade {
  id: number;
  botId: number;
  type: "LONG" | "SHORT";
  entry: number;
  exit: number | null;
  pnl: number | null;
  status: "open" | "closed";
  timestamp: number;
  positionSize: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
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
  positionSize: number;
  candles: Candle[];
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

function generateInitialCandles(basePrice: number, count = 30): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice * (1 + (Math.random() - 0.5) * 0.04);
  const now = Date.now();
  for (let i = count; i > 0; i--) {
    const open = price;
    const close = jitter(open, 0.003);
    const high = Math.max(open, close) * (1 + Math.random() * 0.002);
    const low = Math.min(open, close) * (1 - Math.random() * 0.002);
    candles.push({ time: now - i * 5000, open, high, low, close });
    price = close;
  }
  return candles;
}

function makeBot(id: number, pair: string, strategy: string, sl: string, tp: string, active: boolean, positionSize: number): Bot {
  const base = getBasePrice(pair);
  return {
    id, pair, strategy, sl, tp, active,
    pnl: 0, trades: 0, wins: 0,
    currentPrice: base,
    entryPrice: null, direction: null,
    positionSize,
    candles: generateInitialCandles(base),
  };
}

const INITIAL_BALANCE = 10000;

export interface BalancePoint {
  time: number;
  balance: number;
}

export function useBotSimulation() {
  const [bots, setBots] = useState<Bot[]>([
    makeBot(1, "BTC/USDT", "Scalp", "2%", "4%", true, 500),
    makeBot(2, "ETH/USDT", "Swing", "5%", "12%", true, 500),
    makeBot(3, "SOL/USDT", "Trend", "3%", "8%", false, 500),
  ]);
  const [tradeLog, setTradeLog] = useState<Trade[]>([]);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [balanceHistory, setBalanceHistory] = useState<BalancePoint[]>([{ time: Date.now(), balance: INITIAL_BALANCE }]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const tradeIdRef = useRef(1);

  const addTrade = useCallback((trade: Trade) => {
    setTradeLog((prev) => [trade, ...prev].slice(0, 80));
  }, []);

  // Simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setBots((prev) =>
        prev.map((bot) => {
          const newPrice = bot.active ? jitter(bot.currentPrice) : bot.currentPrice;

          // Update candles
          const candles = [...bot.candles];
          const lastCandle = candles[candles.length - 1];
          const elapsed = Date.now() - (lastCandle?.time || 0);

          if (elapsed > 5000) {
            // New candle
            candles.push({
              time: Date.now(),
              open: newPrice,
              high: newPrice,
              low: newPrice,
              close: newPrice,
            });
            if (candles.length > 60) candles.shift();
          } else if (lastCandle) {
            const c = { ...lastCandle };
            c.close = newPrice;
            c.high = Math.max(c.high, newPrice);
            c.low = Math.min(c.low, newPrice);
            candles[candles.length - 1] = c;
          }

          if (!bot.active) return { ...bot, candles };

          const slPct = parseFloat(bot.sl) / 100;
          const tpPct = parseFloat(bot.tp) / 100;
          let updated = { ...bot, currentPrice: newPrice, candles };

          // If no position, maybe open one
          if (!updated.entryPrice) {
            if (Math.random() < 0.08) {
              const dir: "LONG" | "SHORT" = Math.random() > 0.45 ? "LONG" : "SHORT";
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
                positionSize: bot.positionSize,
              };
              addTrade(trade);
              if (soundEnabled) playOpenSound();
            }
            return updated;
          }

          // Check SL/TP
          const pctChange =
            updated.direction === "LONG"
              ? (newPrice - updated.entryPrice) / updated.entryPrice
              : (updated.entryPrice - newPrice) / updated.entryPrice;

          if (pctChange >= tpPct || pctChange <= -slPct) {
            const tradePnl = pctChange * bot.positionSize;
            const win = pctChange > 0;
            updated.pnl += tradePnl;
            updated.trades += 1;
            updated.wins += win ? 1 : 0;

            setBalance((prev) => {
              const newBal = prev + tradePnl;
              setBalanceHistory((h) => [...h.slice(-200), { time: Date.now(), balance: newBal }]);
              return newBal;
            });

            const trade: Trade = {
              id: tradeIdRef.current++,
              botId: bot.id,
              type: updated.direction!,
              entry: updated.entryPrice,
              exit: newPrice,
              pnl: Math.round(tradePnl * 100) / 100,
              status: "closed",
              timestamp: Date.now(),
              positionSize: bot.positionSize,
            };
            addTrade(trade);

            if (soundEnabled) {
              if (win) playWinSound();
              else playLossSound();
            }

            updated.entryPrice = null;
            updated.direction = null;
          }

          return updated;
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, [addTrade, soundEnabled]);

  const toggleBot = useCallback((id: number) => {
    setBots((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, active: !b.active, entryPrice: null, direction: null } : b
      )
    );
  }, []);

  const createBot = useCallback((pair: string, strategy: string, sl: string, tp: string, positionSize: number) => {
    setBots((prev) => [makeBot(Date.now(), pair, strategy, sl, tp, true, positionSize), ...prev]);
  }, []);

  const deleteBot = useCallback((id: number) => {
    setBots((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const deposit = useCallback((amount: number) => {
    if (amount > 0) setBalance((prev) => {
      const newBal = prev + amount;
      setBalanceHistory((h) => [...h.slice(-200), { time: Date.now(), balance: newBal }]);
      return newBal;
    });
  }, []);

  const withdraw = useCallback((amount: number) => {
    setBalance((prev) => {
      if (amount > 0 && amount <= prev) return prev - amount;
      return prev;
    });
  }, []);

  const totalPnl = bots.reduce((sum, b) => sum + b.pnl, 0);
  const totalTrades = bots.reduce((sum, b) => sum + b.trades, 0);
  const totalWins = bots.reduce((sum, b) => sum + b.wins, 0);
  const winRate = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0;

  return {
    bots, tradeLog, toggleBot, createBot, deleteBot,
    totalPnl, totalTrades, winRate,
    balance, deposit, withdraw,
    soundEnabled, setSoundEnabled,
  };
}
