import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SuggestedUser {
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

const WhoToFollow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSuggestions = async () => {
      // Get who user already follows
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      const followedIds = new Set(follows?.map((f) => f.following_id) || []);
      setFollowingIds(followedIds);

      // Fetch profiles excluding self and already followed
      const excludeIds = [user.id, ...followedIds];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url")
        .not("user_id", "in", `(${excludeIds.join(",")})`)
        .not("username", "is", null)
        .order("created_at", { ascending: false })
        .limit(5);

      setSuggestions(profiles || []);
    };

    fetchSuggestions();
  }, [user]);

  const handleFollow = async (targetId: string) => {
    if (!user) return;
    setLoadingFollow(targetId);
    await supabase.from("follows").insert({ follower_id: user.id, following_id: targetId });

    // Send notification
    await supabase.from("notifications").insert({
      user_id: targetId,
      actor_id: user.id,
      type: "follow",
    });

    setFollowingIds((prev) => new Set([...prev, targetId]));
    setSuggestions((prev) => prev.filter((s) => s.user_id !== targetId));
    setLoadingFollow(null);
  };

  if (!user || suggestions.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold text-foreground">Who to follow</span>
      </div>
      <div className="space-y-3">
        {suggestions.map((s) => (
          <div key={s.user_id} className="flex items-center gap-2.5">
            <button
              onClick={() => navigate(`/user/${s.username || s.user_id}`)}
              className="flex-shrink-0"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={s.avatar_url || undefined} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {(s.display_name || "?")[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
            <button
              onClick={() => navigate(`/user/${s.username || s.user_id}`)}
              className="flex-1 min-w-0 text-left"
            >
              <p className="text-[13px] font-semibold text-foreground truncate hover:text-primary transition-colors">
                {s.display_name || "Anon"}
              </p>
              {s.username && (
                <p className="text-[11px] text-muted-foreground truncate">@{s.username}</p>
              )}
            </button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] px-3 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => handleFollow(s.user_id)}
              disabled={loadingFollow === s.user_id}
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhoToFollow;
