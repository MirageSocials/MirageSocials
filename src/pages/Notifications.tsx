import { useEffect, useState, useCallback } from "react";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import AppLayout from "@/components/AppLayout";

interface Notification {
  id: string;
  type: string;
  actor_id: string;
  post_id: string | null;
  read: boolean;
  created_at: string;
}

interface Profile {
  user_id: string;
  display_name: string | null;
  username: string | null;
}

const iconMap: Record<string, React.ReactNode> = {
  like: <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />,
  reply: <MessageCircle className="h-5 w-5 text-primary" />,
  follow: <UserPlus className="h-5 w-5 text-primary" />,
};

const labelMap: Record<string, string> = {
  like: "liked your post",
  reply: "replied to your post",
  follow: "followed you",
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      setNotifications(data as Notification[]);
      const actorIds = [...new Set(data.map((n: any) => n.actor_id))];
      if (actorIds.length > 0) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_id, display_name, username")
          .in("user_id", actorIds);
        if (profileData) {
          const map: Record<string, Profile> = {};
          profileData.forEach((p: any) => { map[p.user_id] = p; });
          setProfiles(map);
        }
      }
      // Mark all as read
      await supabase
        .from("notifications")
        .update({ read: true } as any)
        .eq("user_id", user.id)
        .eq("read", false);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notif-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => {
        fetchNotifications();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchNotifications]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-xl mx-auto">
        <div className="border-b border-border px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-bold text-foreground mb-1">No notifications yet</p>
            <p className="text-sm">When someone interacts with your posts, you'll see it here.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const actor = profiles[n.actor_id];
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-border transition-colors ${
                  !n.read ? "bg-primary/5" : "hover:bg-secondary/30"
                }`}
              >
                <div className="mt-1">{iconMap[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-bold">{actor?.display_name || "Someone"}</span>{" "}
                    <span className="text-muted-foreground">{labelMap[n.type] || n.type}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
