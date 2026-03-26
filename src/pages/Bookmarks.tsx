import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PostCard from "@/components/PostCard";
import { Bookmark } from "lucide-react";

const Bookmarks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: bookmarks } = await supabase
      .from("bookmarks")
      .select("post_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!bookmarks || bookmarks.length === 0) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const postIds = bookmarks.map((b: any) => b.post_id);
    const { data: postData } = await supabase
      .from("posts")
      .select("*")
      .in("id", postIds);

    if (postData) {
      // Preserve bookmark order
      const postMap = new Map(postData.map((p: any) => [p.id, p]));
      const ordered = postIds.map((id: string) => postMap.get(id)).filter(Boolean);
      setPosts(ordered);

      const userIds = [...new Set(postData.map((p: any) => p.user_id))];
      if (userIds.length > 0) {
        const { data: pData } = await supabase
          .from("profiles")
          .select("user_id, display_name, username, avatar_url")
          .in("user_id", userIds);
        if (pData) {
          const map: Record<string, any> = {};
          pData.forEach((p: any) => { map[p.user_id] = p; });
          setProfiles(map);
        }
      }
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-xl mx-auto">
        <div className="px-4 py-4 border-b border-border sticky top-14 z-40 bg-background/80 backdrop-blur-xl">
          <h1 className="text-xl font-bold text-foreground">Bookmarks</h1>
          <p className="text-xs text-muted-foreground mt-0.5">@{user?.email?.split("@")[0]}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-bold text-foreground mb-1">Save posts for later</p>
            <p className="text-sm text-muted-foreground">Bookmark posts to easily find them again.</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              authorName={profiles[post.user_id]?.display_name}
              authorUsername={profiles[post.user_id]?.username}
              authorAvatar={profiles[post.user_id]?.avatar_url}
              onRefresh={fetchBookmarks}
              onClick={() => navigate(`/post/${post.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
