import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Bell, Mail, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/feed" },
    { icon: Search, label: "Explore", path: "/explore" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Mail, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container max-w-7xl flex items-center justify-between h-14 px-4">
        <button onClick={() => navigate("/")} className="text-xl font-black text-primary tracking-tight">
          𝕏itter
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(user ? item.path : "/auth")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                  active
                    ? "font-bold text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => navigate("/feed")}
                className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2 rounded-full hover:bg-primary/90 transition-colors"
              >
                Post
              </button>
              <button
                onClick={signOut}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex justify-around py-2">
        {navItems.slice(0, 4).map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(user ? item.path : "/auth")}
              className={`p-2 ${active ? "text-foreground" : "text-muted-foreground"}`}
            >
              <item.icon className="h-6 w-6" />
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
