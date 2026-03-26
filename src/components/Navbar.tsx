import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Bell, Mail, User, LogOut, Bookmark, Sun, Moon, Settings, Feather } from "lucide-react";
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
  const [profile, setProfile] = useState<{ display_name: string | null; username: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [{ count: notifCount }, { data: profileData }] = await Promise.all([
        supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false),
        supabase.from("profiles").select("display_name, username, avatar_url").eq("user_id", user.id).single(),
      ]);
      setUnreadNotifs(notifCount || 0);
      if (profileData) setProfile(profileData);

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

    fetchData();

    const channel = supabase
      .channel("navbar-badges")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => fetchData())
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
    { icon: Settings, label: "Settings", path: "/settings", badge: 0 },
  ];

  const Badge = ({ count }: { count: number }) => {
    if (count <= 0) return null;
    return (
      <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-mono px-1 glow-primary">
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[68px] xl:w-[260px] flex-col items-center xl:items-start border-r border-border bg-background/95 backdrop-blur-xl z-50 py-4 px-3 xl:px-5">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="p-3 rounded-xl hover:bg-secondary/50 transition-all mb-4 group">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Feather className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden xl:inline font-bold text-lg tracking-tight text-foreground">
              xitter<span className="text-primary font-mono">_</span>
            </span>
          </div>
        </button>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 flex-1 w-full">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(user ? item.path : "/auth")}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all w-full group relative ${
                  active 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <span className="relative">
                  <item.icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.6} />
                  <Badge count={item.badge} />
                </span>
                <span className={`hidden xl:inline text-[14px] font-medium ${active ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all w-full hover:bg-secondary/60 text-muted-foreground hover:text-foreground group"
          >
            {theme === "dark" ? (
              <Sun className="h-[22px] w-[22px]" strokeWidth={1.6} />
            ) : (
              <Moon className="h-[22px] w-[22px]" strokeWidth={1.6} />
            )}
            <span className="hidden xl:inline text-[14px] font-medium">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>
        </nav>

        {/* Post button */}
        <button
          onClick={() => navigate(user ? "/feed" : "/auth")}
          className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-3 mt-3 hover:brightness-110 transition-all text-[14px] hidden xl:block glow-primary"
        >
          Post
        </button>
        <button
          onClick={() => navigate(user ? "/feed" : "/auth")}
          className="xl:hidden p-3 bg-primary text-primary-foreground rounded-xl hover:brightness-110 transition-all mt-3 glow-primary"
        >
          <Feather className="h-5 w-5" />
        </button>

        {/* User profile pill */}
        {user && profile && (
          <div className="mt-3 w-full">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-secondary/60 transition-all"
            >
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0 ring-1 ring-border" />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold font-mono text-primary">
                  {(profile.display_name || "U")[0]?.toUpperCase()}
                </div>
              )}
              <div className="hidden xl:block text-left min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">{profile.display_name || "User"}</p>
                <p className="text-[11px] text-muted-foreground truncate font-mono">@{profile.username || "user"}</p>
              </div>
            </button>
            <button
              onClick={signOut}
              className="hidden xl:flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-secondary/60 transition-all text-muted-foreground hover:text-destructive mt-0.5"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-[13px]">Log out</span>
            </button>
          </div>
        )}
      </aside>

      {/* ── Mobile Top Bar ── */}
      <header className="md:hidden sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-13 px-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Feather className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">
              xitter<span className="text-primary font-mono">_</span>
            </span>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/60">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user ? (
              <button onClick={signOut} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/60">
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={() => navigate("/auth")} className="bg-primary text-primary-foreground font-bold text-xs px-4 py-1.5 rounded-lg hover:brightness-110 transition-all">
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border flex justify-around py-1.5">
        {navItems.slice(0, 5).map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(user ? item.path : "/auth")}
              className={`p-2.5 relative transition-all rounded-xl ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <item.icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.6} />
              <Badge count={item.badge} />
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
