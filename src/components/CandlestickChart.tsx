import { useMemo } from "react";
import type { Candle } from "@/hooks/useBotSimulation";

interface Props {
  candles: Candle[];
  pair: string;
  height?: number;
}

const CandlestickChart = ({ candles, pair, height = 120 }: Props) => {
  const chartData = useMemo(() => {
    if (candles.length === 0) return null;

    const allPrices = candles.flatMap((c) => [c.high, c.low]);
    const minP = Math.min(...allPrices);
    const maxP = Math.max(...allPrices);
    const range = maxP - minP || 1;
    const padding = range * 0.1;
    const yMin = minP - padding;
    const yMax = maxP + padding;

    const w = 600;
    const h = height;
    const candleW = Math.max(2, (w - 20) / candles.length - 2);

    return { yMin, yMax, w, h, candleW, range: yMax - yMin };
  }, [candles, height]);

  if (!chartData || candles.length < 2) {
    return (
      <div className="flex items-center justify-center text-xs text-muted-foreground" style={{ height }}>
        Collecting data…
      </div>
    );
  }

  const { yMin, yMax, w, h, candleW } = chartData;
  const scaleY = (price: number) => h - ((price - yMin) / (yMax - yMin)) * (h - 10) - 5;

  return (
    <div className="w-full overflow-hidden rounded-lg bg-secondary/30">
      <div className="px-3 pt-2 pb-1 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{pair} — 5s candles</span>
        <span className="text-[10px] font-mono text-foreground">
          {candles[candles.length - 1].close >= 1000
            ? candles[candles.length - 1].close.toFixed(2)
            : candles[candles.length - 1].close >= 1
            ? candles[candles.length - 1].close.toFixed(3)
            : candles[candles.length - 1].close.toFixed(5)}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => {
          const y = h * pct;
          return (
            <line
              key={pct}
              x1={0} y1={y} x2={w} y2={y}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          );
        })}

        {candles.map((c, i) => {
          const x = 10 + i * ((w - 20) / candles.length) + candleW / 2;
          const isGreen = c.close >= c.open;
          const color = isGreen ? "hsl(var(--positive))" : "hsl(var(--negative))";
          const bodyTop = scaleY(Math.max(c.open, c.close));
          const bodyBot = scaleY(Math.min(c.open, c.close));
          const bodyH = Math.max(1, bodyBot - bodyTop);

          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x} y1={scaleY(c.high)}
                x2={x} y2={scaleY(c.low)}
                stroke={color}
                strokeWidth={1}
              />
              {/* Body */}
              <rect
                x={x - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyH}
                fill={color}
                rx={0.5}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CandlestickChart;
