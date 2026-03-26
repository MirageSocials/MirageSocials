import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Hash, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import PostCard from "@/components/PostCard";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  image_url: string | null;
  repost_id: string | null;
}

interface Profile {
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

const HashtagPage = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!tag) return;
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("*")
      .ilike("content", `%#${tag}%`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      setPosts(data as Post[]);
      const ids = [...new Set(data.map((p: any) => p.user_id))];
      if (ids.length > 0) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id, display_name, username, avatar_url")
          .in("user_id", ids);
        if (profs) {
          const map: Record<string, Profile> = {};
          profs.forEach((p: any) => { map[p.user_id] = p; });
          setProfiles(map);
        }
      }
    }
    setLoading(false);
  }, [tag]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="px-4 py-3 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Hash className="h-4 w-4 text-primary" />
                </div>
                <h1 className="text-xl font-black text-foreground">#{tag}</h1>
              </div>
              <p className="text-xs text-muted-foreground ml-10">{posts.length} posts</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <Hash className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-foreground font-bold text-lg">No posts with #{tag}</p>
            <p className="text-muted-foreground text-sm mt-1">Be the first to use this hashtag!</p>
          </div>
        ) : (
          posts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <PostCard
                post={p}
                authorName={profiles[p.user_id]?.display_name || undefined}
                authorUsername={profiles[p.user_id]?.username || undefined}
                authorAvatar={profiles[p.user_id]?.avatar_url}
                onRefresh={fetchPosts}
                onClick={() => navigate(`/post/${p.id}`)}
              />
            </motion.div>
          ))
        )}
    </AppLayout>
  );
};

export default HashtagPage;
