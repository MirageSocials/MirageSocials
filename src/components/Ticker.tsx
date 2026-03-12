const items = [
  { name: "BTC/USDT", pnl: "+2.4%", positive: true },
  { name: "ETH/USDT", pnl: "-0.8%", positive: false },
  { name: "SOL/USDT", pnl: "+5.1%", positive: true },
  { name: "ARB/USDT", pnl: "+1.3%", positive: true },
  { name: "DOGE/USDT", pnl: "+0.9%", positive: true },
  { name: "AVAX/USDT", pnl: "-0.2%", positive: false },
];

const Ticker = () => {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="w-full overflow-hidden border-y border-border py-2.5 bg-card/50">
      <div className="ticker-scroll flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 mx-6 text-[10px] tracking-wider">
            <span className="text-muted-foreground">{item.name}</span>
            <span className={item.positive ? "text-primary" : "text-negative"}>{item.pnl}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
