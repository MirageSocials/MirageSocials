import { Zap } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-mono text-lg font-bold tracking-wider text-foreground">
            PERPBOT
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            How
          </a>
          <a href="#features" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="#strategies" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Strategies
          </a>
        </div>
        <button className="font-mono text-xs uppercase tracking-widest border border-primary text-primary px-5 py-2 rounded hover:bg-primary hover:text-primary-foreground transition-all">
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
