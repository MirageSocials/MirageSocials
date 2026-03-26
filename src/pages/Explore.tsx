import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Hash, TrendingUp, Users, Flame, Sparkles, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
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
  poll_expires_at?: string | null;
}

const categories = [
  { label: "For You", icon: Sparkles },
  { label: "Trending", icon: Flame },
  { label: "People", icon: Users },
  { label: "Discussions", icon: MessageCircle },
];

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("For You");
  const [users, setUsers] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postProfiles, setPostProfiles] = useState<Record<string, Profile>>({});
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [trendingProfiles, setTrendingProfiles] = useState<Record<string, Profile>>({});
  const [suggestedUsers, setSuggestedUsers] = useState<Profile[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<{ tag: string; count: number }[]>([]);
  const [topPosts, setTopPosts] = useState<{ post: Post; likes: number }[]>([]);
  const [topPostProfiles, setTopPostProfiles] = useState<Record<string, Profile>>({});
  const [discussionPosts, setDiscussionPosts] = useState<Post[]>([]);
  const [discussionProfiles, setDiscussionProfiles] = useState<Record<string, Profile>>({});

  const fetchProfilesForPosts = async (postList: Post[]) => {
    const userIds = [...new Set(postList.map((p) => p.user_id))];
    if (userIds.length === 0) return {};
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, username, avatar_url, bio")
      .in("user_id", userIds);
    const map: Record<string, Profile> = {};
    (profiles || []).forEach((p: any) => { map[p.user_id] = p; });
    return map;
  };

  useEffect(() => {
    const fetchTrending = async () => {
      // Fetch recent posts
      const { data } = await supabase
        .from("posts")
        .select("*")
        .is("parent_id", null)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) {
        setTrendingPosts((data as Post[]).slice(0, 20));
        const profiles = await fetchProfilesForPosts(data as Post[]);
        setTrendingProfiles(profiles);

        // Extract trending hashtags
        const tagCounts: Record<string, number> = {};
        data.forEach((p: any) => {
          extractHashtags(p.content).forEach((t) => {
            tagCounts[t] = (tagCounts[t] || 0) + 1;
          });
        });
        const sorted = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        setTrendingHashtags(sorted);

        // Top posts by likes
        const postIds = data.map((p: any) => p.id);
        if (postIds.length > 0) {
          const { data: likes } = await supabase
            .from("likes")
            .select("post_id")
            .in("post_id", postIds);
          const likeCounts: Record<string, number> = {};
          (likes || []).forEach((l: any) => {
            likeCounts[l.post_id] = (likeCounts[l.post_id] || 0) + 1;
          });
          const ranked = data
            .map((p: any) => ({ post: p as Post, likes: likeCounts[p.id] || 0 }))
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 15);
          setTopPosts(ranked);
          const topProfiles = await fetchProfilesForPosts(ranked.map((r) => r.post));
          setTopPostProfiles(topProfiles);
        }

        // Discussion posts (posts with most replies)
        const { data: replyCounts } = await supabase
          .from("posts")
          .select("parent_id")
          .not("parent_id", "is", null);
        const replyMap: Record<string, number> = {};
        (replyCounts || []).forEach((r: any) => {
          if (r.parent_id) replyMap[r.parent_id] = (replyMap[r.parent_id] || 0) + 1;
        });
        const discussionSorted = data
          .filter((p: any) => (replyMap[p.id] || 0) > 0)
          .sort((a: any, b: any) => (replyMap[b.id] || 0) - (replyMap[a.id] || 0))
          .slice(0, 10) as Post[];
        setDiscussionPosts(discussionSorted);
        const discProfiles = await fetchProfilesForPosts(discussionSorted);
        setDiscussionProfiles(discProfiles);
      }

      // Suggested users
      const { data: allUsers } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, bio")
        .limit(15);
      if (allUsers) setSuggestedUsers(allUsers as Profile[]);
    };
    fetchTrending();
  }, []);

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
    // Search both users and posts
    const [{ data: userResults }, { data: postResults }] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, username, avatar_url, bio")
        .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`).limit(10),
      supabase.from("posts").select("*").ilike("content", `%${query}%`)
        .is("parent_id", null).order("created_at", { ascending: false }).limit(20),
    ]);
    setUsers((userResults as Profile[]) || []);
    if (postResults) {
      setPosts(postResults as Post[]);
      const profiles = await fetchProfilesForPosts(postResults as Post[]);
      setPostProfiles(profiles);
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
          user_id: targetId, actor_id: user.id, type: "follow",
        } as any);
      }
    }
  };

  const UserCard = ({ profile }: { profile: Profile }) => (
    <div
      onClick={() => navigate(`/user/${profile.user_id}`)}
      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer"
    >
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
          onClick={(e) => { e.stopPropagation(); toggleFollow(profile.user_id); }}
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
    <AppLayout>
      {/* Search bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl p-3">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search users, posts, hashtags..."
            className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!hasSearched && (
        <div className="flex border-b border-border overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`flex items-center gap-1.5 flex-1 min-w-0 py-3 px-2 text-[13px] font-medium relative whitespace-nowrap justify-center ${
                activeCategory === cat.label ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <cat.icon className="h-3.5 w-3.5" />
              {cat.label}
              {activeCategory === cat.label && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : hasSearched ? (
        <>
          {/* Search Results */}
          {users.length > 0 && (
            <div className="border-b border-border">
              <h3 className="px-4 pt-3 pb-1 text-sm font-bold text-foreground">People</h3>
              {users.slice(0, 3).map((u) => <UserCard key={u.user_id} profile={u} />)}
            </div>
          )}
          {posts.length > 0 && (
            <div>
              <h3 className="px-4 pt-3 pb-1 text-sm font-bold text-foreground">Posts</h3>
              {posts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  authorName={postProfiles[p.user_id]?.display_name || undefined}
                  authorUsername={postProfiles[p.user_id]?.username || undefined}
                  authorAvatar={postProfiles[p.user_id]?.avatar_url}
                  onClick={() => navigate(`/post/${p.id}`)}
                />
              ))}
            </div>
          )}
          {users.length === 0 && posts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No results found</p>
          )}
        </>
      ) : (
        <>
          {activeCategory === "For You" && (
            <>
              {/* Trending hashtags */}
              {trendingHashtags.length > 0 && (
                <div className="border-b border-border px-4 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold text-foreground">Trending topics</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingHashtags.map(({ tag, count }) => (
                      <button
                        key={tag}
                        onClick={() => navigate(`/hashtag/${tag.slice(1)}`)}
                        className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        {tag} <span className="text-primary/60 text-xs ml-1">{count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested users */}
              <div className="border-b border-border">
                <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Who to follow
                </h2>
                {suggestedUsers
                  .filter((u) => u.user_id !== user?.id)
                  .slice(0, 5)
                  .map((u) => <UserCard key={u.user_id} profile={u} />)}
              </div>

              {/* Recent posts */}
              <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Latest
              </h2>
              {trendingPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  authorName={trendingProfiles[p.user_id]?.display_name || undefined}
                  authorUsername={trendingProfiles[p.user_id]?.username || undefined}
                  authorAvatar={trendingProfiles[p.user_id]?.avatar_url}
                  onClick={() => navigate(`/post/${p.id}`)}
                />
              ))}
            </>
          )}

          {activeCategory === "Trending" && (
            <>
              {/* Trending hashtags full */}
              {trendingHashtags.length > 0 && (
                <div className="border-b border-border">
                  {trendingHashtags.map(({ tag, count }, i) => (
                    <button
                      key={tag}
                      onClick={() => navigate(`/hashtag/${tag.slice(1)}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left"
                    >
                      <span className="text-xs text-muted-foreground font-mono w-5">{i + 1}</span>
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-sm">{tag}</p>
                        <p className="text-xs text-muted-foreground">{count} post{count !== 1 ? "s" : ""}</p>
                      </div>
                      <Hash className="h-4 w-4 text-primary/40" />
                    </button>
                  ))}
                </div>
              )}

              {/* Top liked posts */}
              <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-foreground flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                Most liked
              </h2>
              {topPosts.map(({ post: p, likes }) => (
                <PostCard
                  key={p.id}
                  post={p}
                  authorName={topPostProfiles[p.user_id]?.display_name || undefined}
                  authorUsername={topPostProfiles[p.user_id]?.username || undefined}
                  authorAvatar={topPostProfiles[p.user_id]?.avatar_url}
                  onClick={() => navigate(`/post/${p.id}`)}
                />
              ))}
            </>
          )}

          {activeCategory === "People" && (
            <div>
              <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-foreground">Discover people</h2>
              {suggestedUsers
                .filter((u) => u.user_id !== user?.id)
                .map((u) => <UserCard key={u.user_id} profile={u} />)}
            </div>
          )}

          {activeCategory === "Discussions" && (
            <>
              <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                Hot discussions
              </h2>
              {discussionPosts.length > 0 ? (
                discussionPosts.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    authorName={discussionProfiles[p.user_id]?.display_name || undefined}
                    authorUsername={discussionProfiles[p.user_id]?.username || undefined}
                    authorAvatar={discussionProfiles[p.user_id]?.avatar_url}
                    onClick={() => navigate(`/post/${p.id}`)}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-12">No discussions yet</p>
              )}
            </>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default Explore;
