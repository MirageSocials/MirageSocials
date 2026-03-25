import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Hash, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { toast } from "sonner";
import { extractHashtags } from "@/lib/hashtags";

interface Profile {
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  image_url: string | null;
  repost_id: string | null;
}

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"users" | "posts">("users");
  const [users, setUsers] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postProfiles, setPostProfiles] = useState<Record<string, Profile>>({});
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [trendingProfiles, setTrendingProfiles] = useState<Record<string, Profile>>({});
  const [suggestedUsers, setSuggestedUsers] = useState<Profile[]>([]);

  // Fetch initial trending content
  useEffect(() => {
    const fetchTrending = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .is("parent_id", null)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) {
        setTrendingPosts(data as Post[]);
        const userIds = [...new Set(data.map((p: any) => p.user_id))];
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, display_name, username, avatar_url, bio")
            .in("user_id", userIds);
          if (profiles) {
            const map: Record<string, Profile> = {};
            profiles.forEach((p: any) => { map[p.user_id] = p; });
            setTrendingProfiles(map);
          }
        }
      }

      // Suggested users
      const { data: allUsers } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, bio")
        .limit(10);
      if (allUsers) setSuggestedUsers(allUsers as Profile[]);
    };
    fetchTrending();
  }, []);

  // Fetch following state
  useEffect(() => {
    if (!user) return;
    const fetchFollowing = async () => {
      const { data } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);
      if (data) setFollowing(new Set(data.map((f: any) => f.following_id)));
    };
    fetchFollowing();
  }, [user]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    if (tab === "users") {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, bio")
        .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(20);
      setUsers((data as Profile[]) || []);
    } else {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .ilike("content", `%${query}%`)
        .is("parent_id", null)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) {
        setPosts(data as Post[]);
        const userIds = [...new Set(data.map((p: any) => p.user_id))];
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, display_name, username, avatar_url, bio")
            .in("user_id", userIds);
          if (profiles) {
            const map: Record<string, Profile> = {};
            profiles.forEach((p: any) => { map[p.user_id] = p; });
            setPostProfiles(map);
          }
        }
      }
    }
    setLoading(false);
  };

  const toggleFollow = async (targetId: string) => {
    if (!user) return;
    if (following.has(targetId)) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", targetId);
      setFollowing((prev) => { const n = new Set(prev); n.delete(targetId); return n; });
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: targetId } as any);
      setFollowing((prev) => new Set(prev).add(targetId));
      if (targetId !== user.id) {
        await supabase.from("notifications").insert({
          user_id: targetId,
          actor_id: user.id,
          type: "follow",
        } as any);
      }
    }
  };

  const UserCard = ({ profile }: { profile: Profile }) => (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors">
      {profile.avatar_url ? (
        <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-lg font-bold text-muted-foreground">
          {(profile.display_name || "U")[0]?.toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-foreground truncate">{profile.display_name || "User"}</p>
        <p className="text-sm text-muted-foreground truncate">@{profile.username || profile.user_id.slice(0, 8)}</p>
        {profile.bio && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{profile.bio}</p>}
      </div>
      {user && profile.user_id !== user.id && (
        <button
          onClick={() => toggleFollow(profile.user_id)}
          className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors ${
            following.has(profile.user_id)
              ? "bg-transparent border border-border text-foreground hover:border-destructive hover:text-destructive"
              : "bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          {following.has(profile.user_id) ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );

  const hasSearched = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-xl mx-auto">
        {/* Search bar */}
        <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-xl p-3">
          <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search users or posts..."
              className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => { setTab("users"); if (hasSearched) handleSearch(); }}
            className={`flex-1 py-3 text-sm font-medium relative ${tab === "users" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Users
            {tab === "users" && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />}
          </button>
          <button
            onClick={() => { setTab("posts"); if (hasSearched) handleSearch(); }}
            className={`flex-1 py-3 text-sm font-medium relative ${tab === "posts" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Posts
            {tab === "posts" && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : hasSearched ? (
          tab === "users" ? (
            users.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No users found</p>
            ) : (
              users.map((u) => <UserCard key={u.user_id} profile={u} />)
            )
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No posts found</p>
          ) : (
            posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                authorName={postProfiles[p.user_id]?.display_name || undefined}
                authorUsername={postProfiles[p.user_id]?.username || undefined}
                authorAvatar={postProfiles[p.user_id]?.avatar_url}
              />
            ))
          )
        ) : (
          <>
            {/* Suggested users */}
            <div className="border-b border-border">
              <h2 className="px-4 pt-4 pb-2 text-lg font-bold text-foreground">Who to follow</h2>
              {suggestedUsers
                .filter((u) => u.user_id !== user?.id)
                .slice(0, 5)
                .map((u) => (
                  <UserCard key={u.user_id} profile={u} />
                ))}
            </div>

            {/* Trending posts */}
            <h2 className="px-4 pt-4 pb-2 text-lg font-bold text-foreground">Trending</h2>
            {trendingPosts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                authorName={trendingProfiles[p.user_id]?.display_name || undefined}
                authorUsername={trendingProfiles[p.user_id]?.username || undefined}
                authorAvatar={trendingProfiles[p.user_id]?.avatar_url}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
