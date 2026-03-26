import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";

const PAGE_SIZE = 20;

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [tab, setTab] = useState<"for-you" | "following">("for-you");
  const [followingIds, setFollowingIds] = useState<string[] | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchProfiles = useCallback(async (userIds: string[]) => {
    const missing = userIds.filter((id) => !profiles[id]);
    if (missing.length === 0) return;
    const { data } = await supabase
      .from("profiles")
      .select("user_id, display_name, username, avatar_url")
      .in("user_id", missing);
    if (data) {
      setProfiles((prev) => {
        const next = { ...prev };
        data.forEach((p: any) => { next[p.user_id] = p; });
        return next;
      });
    }
  }, [profiles]);

  useEffect(() => {
    if (tab === "following" && user) {
      supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id)
        .then(({ data }) => {
          setFollowingIds(data?.map((f: any) => f.following_id) || []);
        });
    } else {
      setFollowingIds(null);
    }
  }, [tab, user]);

  const fetchPosts = useCallback(async (append = false, cursor?: string) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    let query = supabase
      .from("posts")
      .select("*")
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (cursor) query = query.lt("created_at", cursor);

    if (tab === "following") {
      if (!followingIds || followingIds.length === 0) {
        setPosts([]);
        setHasMore(false);
        setLoading(false);
        return;
      }
      query = query.in("user_id", followingIds);
    }

    const { data, error } = await query;
    if (!error && data) {
      const newPosts = data as Post[];
      setPosts((prev) => append ? [...prev, ...newPosts] : newPosts);
      setHasMore(newPosts.length === PAGE_SIZE);
      const userIds = [...new Set(newPosts.map((p) => p.user_id))];
      if (userIds.length > 0) fetchProfiles(userIds);
    }

    setLoading(false);
    setLoadingMore(false);
  }, [tab, followingIds, fetchProfiles]);

  useEffect(() => {
    if (tab === "following" && followingIds === null) return;
    setPosts([]);
    setHasMore(true);
    fetchPosts(false);
  }, [tab, followingIds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const channel = supabase
      .channel("posts-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
        const newPost = payload.new as Post;
        if (newPost.parent_id) return;
        if (tab === "following" && followingIds && !followingIds.includes(newPost.user_id)) return;
        setPosts((prev) => {
          if (prev.some((p) => p.id === newPost.id)) return prev;
          return [newPost, ...prev];
        });
        fetchProfiles([newPost.user_id]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tab, followingIds, fetchProfiles]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          const lastPost = posts[posts.length - 1];
          if (lastPost) fetchPosts(true, lastPost.created_at);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, posts, fetchPosts]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Main content with sidebar offset */}
      <main className="md:ml-[68px] xl:ml-[260px]">
        <div className="max-w-[600px] mx-auto border-x border-border min-h-screen">
          {/* Sticky tabs */}
          <div className="sticky top-0 md:top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="flex">
              <button
                onClick={() => setTab("for-you")}
                className={`flex-1 py-4 text-[15px] font-medium transition-colors relative hover:bg-secondary/30 ${
                  tab === "for-you" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                For you
                {tab === "for-you" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setTab("following")}
                className={`flex-1 py-4 text-[15px] font-medium transition-colors relative hover:bg-secondary/30 ${
                  tab === "following" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Following
                {tab === "following" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </div>

          <PostComposer onPostCreated={() => fetchPosts(false)} />

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-bold text-foreground mb-1">No posts yet</p>
              <p className="text-sm text-muted-foreground">Be the first to post something!</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  authorName={profiles[post.user_id]?.display_name || undefined}
                  authorUsername={profiles[post.user_id]?.username || undefined}
                  authorAvatar={profiles[post.user_id]?.avatar_url}
                  onRefresh={() => fetchPosts(false)}
                  onClick={() => navigate(`/post/${post.id}`)}
                />
              ))}
              <div ref={sentinelRef} className="py-8 flex justify-center">
                {loadingMore && (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
                {!hasMore && posts.length > 0 && (
                  <p className="text-xs text-muted-foreground">You've reached the end</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 md:bottom-8 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all animate-fade-in"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Feed;
