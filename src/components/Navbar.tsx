import { Zap } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-semibold text-base text-foreground tracking-tight">PerpBot</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {["How it works", "Features", "Strategies"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {item}
            </a>
          ))}
        </div>
        <button className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
