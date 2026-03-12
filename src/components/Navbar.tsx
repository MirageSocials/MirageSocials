import { Zap } from "lucide-react";

const Navbar = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-semibold text-base text-foreground tracking-tight">PerpBot</span>
        </button>
        <div className="hidden md:flex items-center gap-6">
          {["How it works", "Features", "Strategies"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase().replace(/ /g, "-"))}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollTo("cta")}
          className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all active:scale-95"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
