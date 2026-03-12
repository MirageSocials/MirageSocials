import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-lg font-bold tracking-tight text-foreground"
        >
          perp<span className="text-muted-foreground font-normal">bot</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "How it works", id: "how-it-works" },
            { label: "Features", id: "features" },
            { label: "Performance", id: "performance" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium bg-foreground text-background px-5 py-2 rounded-full hover:bg-foreground/90 transition-all active:scale-95"
          >
            Start Trading
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
