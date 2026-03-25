import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Bell, Mail, User, LogOut, Bookmark, Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      const { count: notifCount } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnreadNotifs(notifCount || 0);

      // Get conversations the user is part of
      const { data: convos } = await supabase
        .from("conversations")
        .select("id")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      if (convos && convos.length > 0) {
        const convoIds = convos.map((c) => c.id);
        const { count: msgCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .in("conversation_id", convoIds)
          .neq("sender_id", user.id)
          .eq("read", false);
        setUnreadMessages(msgCount || 0);
      }
    };

    fetchUnread();

    // Realtime for notifications
    const channel = supabase
      .channel("navbar-badges")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => fetchUnread())
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => fetchUnread())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const navItems = [
    { icon: Home, label: "Home", path: "/feed", badge: 0 },
    { icon: Search, label: "Explore", path: "/explore", badge: 0 },
    { icon: Bell, label: "Notifications", path: "/notifications", badge: unreadNotifs },
    { icon: Mail, label: "Messages", path: "/messages", badge: unreadMessages },
    { icon: Bookmark, label: "Bookmarks", path: "/bookmarks", badge: 0 },
    { icon: User, label: "Profile", path: "/profile", badge: 0 },
  ];

  const Badge = ({ count }: { count: number }) => {
    if (count <= 0) return null;
    return (
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold px-1">
        {count > 99 ? "99+" : count}
      </span>
    );
  };

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
                <span className="relative">
                  <item.icon className="h-5 w-5" />
                  <Badge count={item.badge} />
                </span>
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
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
              className={`p-2 relative ${active ? "text-foreground" : "text-muted-foreground"}`}
            >
              <item.icon className="h-6 w-6" />
              <Badge count={item.badge} />
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
