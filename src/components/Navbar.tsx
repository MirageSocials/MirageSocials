import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Wallet } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl">
      <div className="flex h-11 items-center justify-between bg-card/60 backdrop-blur-xl border border-border rounded-full px-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">◎</span>
          <span className="text-xs font-mono tracking-wider text-foreground">luna agent</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://x.com/LunaOnperp" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground transition-colors">
            <Users className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground transition-colors">
            <Wallet className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
