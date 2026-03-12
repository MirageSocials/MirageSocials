import { useNavigate } from "react-router-dom";
import { Terminal } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="flex h-12 items-center justify-between bg-card/80 backdrop-blur-xl border border-border rounded-full px-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 text-sm font-bold tracking-tight font-mono text-foreground"
        >
          <Terminal className="h-4 w-4 text-primary" />
          perpbot
        </button>

        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "HOW", id: "how-it-works" },
            { label: "FEATURES", id: "features" },
            { label: "AGENTS", id: "performance" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/auth")}
            className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="text-[10px] font-bold tracking-widest uppercase bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:bg-primary/90 transition-all active:scale-95"
          >
            Launch App
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
