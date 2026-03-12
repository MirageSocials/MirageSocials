const items = [
  { name: "BTC-SCALP", pnl: "+$2,847", positive: true },
  { name: "ETH-SWING", pnl: "-$412", positive: false },
  { name: "SOL-TREND", pnl: "+$5,120", positive: true },
  { name: "ARB-NEWS", pnl: "+$1,300", positive: true },
  { name: "DOGE-SCALP", pnl: "+$890", positive: true },
  { name: "AVAX-HOLD", pnl: "-$201", positive: false },
];

const Ticker = () => {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="w-full overflow-hidden border-y border-border bg-accent/30 py-2.5">
      <div className="ticker-scroll flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 mx-5 text-xs font-medium">
            <span className="text-muted-foreground">{item.name}</span>
            <span className={item.positive ? "text-positive" : "text-negative"}>{item.pnl}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
