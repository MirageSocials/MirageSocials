import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  image_url: string | null;
}

interface Profile {
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"for-you" | "following">("for-you");

  const fetchPosts = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("posts")
      .select("*")
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (tab === "following" && user) {
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);
      const followingIds = follows?.map((f: any) => f.following_id) || [];
      if (followingIds.length > 0) {
        query = query.in("user_id", followingIds);
      } else {
        setPosts([]);
        setLoading(false);
        return;
      }
    }

    const { data, error } = await query;
    if (!error && data) {
      setPosts(data as Post[]);
      const userIds = [...new Set(data.map((p: any) => p.user_id))];
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_id, display_name, username, avatar_url")
          .in("user_id", userIds);
        if (profileData) {
          const map: Record<string, Profile> = {};
          profileData.forEach((p: any) => { map[p.user_id] = p; });
          setProfiles(map);
        }
      }
    }
    setLoading(false);
  }, [tab, user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const channel = supabase
      .channel("posts-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, () => {
        fetchPosts();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-xl mx-auto">
        <div className="flex border-b border-border sticky top-14 z-40 bg-background/80 backdrop-blur-xl">
          <button
            onClick={() => setTab("for-you")}
            className={`flex-1 py-3.5 text-sm font-medium transition-colors relative ${
              tab === "for-you" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            For you
            {tab === "for-you" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setTab("following")}
            className={`flex-1 py-3.5 text-sm font-medium transition-colors relative ${
              tab === "following" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Following
            {tab === "following" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />
            )}
          </button>
        </div>

        <PostComposer onPostCreated={fetchPosts} />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-bold text-foreground mb-1">No posts yet</p>
            <p className="text-sm">Be the first to post something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              authorName={profiles[post.user_id]?.display_name || undefined}
              authorUsername={profiles[post.user_id]?.username || undefined}
              authorAvatar={profiles[post.user_id]?.avatar_url}
              onRefresh={fetchPosts}
              onClick={() => navigate(`/post/${post.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
