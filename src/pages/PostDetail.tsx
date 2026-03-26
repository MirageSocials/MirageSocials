import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Repeat2, Share, Trash2, Quote, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import { renderContentWithHashtags } from "@/lib/hashtags";

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
  bio: string | null;
}

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<Profile | null>(null);
  const [replies, setReplies] = useState<Post[]>([]);
  const [replyProfiles, setReplyProfiles] = useState<Record<string, Profile>>({});
  const [parentThread, setParentThread] = useState<{ post: Post; profile: Profile | null }[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setLoading(true);

    const { data } = await supabase.from("posts").select("*").eq("id", postId).single();
    if (!data) { setLoading(false); return; }
    setPost(data as Post);

    // Author
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id, display_name, username, avatar_url, bio")
      .eq("user_id", data.user_id)
      .single();
    setAuthor(profile as Profile | null);

    // Counts
    const [{ count: likes }, { data: userLike }, { count: reps }, { count: reposts }] = await Promise.all([
      supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", postId),
      user ? supabase.from("likes").select("id").eq("post_id", postId).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("parent_id", postId),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("repost_id", postId),
    ]);
    setLikeCount(likes || 0);
    setLiked(!!userLike);
    setReplyCount(reps || 0);
    setRepostCount(reposts || 0);

    // Replies
    const { data: replyData } = await supabase
      .from("posts")
      .select("*")
      .eq("parent_id", postId)
      .order("created_at", { ascending: true })
      .limit(100);
    if (replyData) {
      setReplies(replyData as Post[]);
      const ids = [...new Set(replyData.map((r: any) => r.user_id))];
      if (ids.length > 0) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id, display_name, username, avatar_url, bio")
          .in("user_id", ids);
        if (profs) {
          const map: Record<string, Profile> = {};
          profs.forEach((p: any) => { map[p.user_id] = p; });
          setReplyProfiles(map);
        }
      }
    }

    // Parent thread (walk up)
    const thread: { post: Post; profile: Profile | null }[] = [];
    let currentParentId = data.parent_id;
    while (currentParentId) {
      const { data: parentPost } = await supabase.from("posts").select("*").eq("id", currentParentId).single();
      if (!parentPost) break;
      const { data: parentProfile } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, bio")
        .eq("user_id", parentPost.user_id)
        .single();
      thread.unshift({ post: parentPost as Post, profile: parentProfile as Profile | null });
      currentParentId = parentPost.parent_id;
    }
    setParentThread(thread);
    setLoading(false);
  }, [postId, user]);

  useEffect(() => { fetchPost(); }, [fetchPost]);

  const toggleLike = async () => {
    if (!user || !post) return;
    if (liked) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", user.id);
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, post_id: post.id } as any);
      setLiked(true);
      setLikeCount((c) => c + 1);
      if (post.user_id !== user.id) {
        await supabase.from("notifications").insert({
          user_id: post.user_id, actor_id: user.id, type: "like", post_id: post.id,
        } as any);
      }
    }
  };

  const handleDelete = async () => {
    if (!user || !post || user.id !== post.user_id) return;
    await supabase.from("posts").delete().eq("id", post.id);
    navigate(-1);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-2xl font-bold text-foreground">Post not found</p>
          <p className="text-muted-foreground mt-2">It might have been deleted.</p>
        </div>
      </AppLayout>
    );
  }

  const displayName = author?.display_name || "User";
  const handle = author?.username || post.user_id.slice(0, 8);

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Post</h1>
        </div>

        {/* Parent thread */}
        {parentThread.map((item, i) => (
          <div key={item.post.id} className="relative">
            <div
              onClick={() => navigate(`/post/${item.post.id}`)}
              className="px-4 py-3 hover:bg-secondary/20 transition-colors cursor-pointer flex gap-3"
            >
              {item.profile?.avatar_url ? (
                <div className="relative flex flex-col items-center">
                  <img src={item.profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="w-0.5 flex-1 bg-border mt-1" />
                </div>
              ) : (
                <div className="relative flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                    {(item.profile?.display_name || "U")[0]?.toUpperCase()}
                  </div>
                  <div className="w-0.5 flex-1 bg-border mt-1" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="font-bold text-foreground truncate">{item.profile?.display_name || "User"}</span>
                  <span className="text-muted-foreground truncate">@{item.profile?.username || item.post.user_id.slice(0, 8)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground shrink-0">{formatDistanceToNow(new Date(item.post.created_at), { addSuffix: false })}</span>
                </div>
                <p className="text-foreground text-[15px] mt-1 whitespace-pre-wrap break-words">
                  {renderContentWithHashtags(item.post.content)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Main post — expanded view */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border"
        >
          <div className="px-4 pt-3">
            {/* Author row */}
            <div className="flex items-center gap-3">
              {author?.avatar_url ? (
                <img src={author.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-[15px]">{displayName}</p>
                <p className="text-muted-foreground text-sm">@{handle}</p>
              </div>
              {user?.id === post.user_id && (
                <button onClick={handleDelete} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="mt-4">
              <p className="text-foreground text-xl leading-relaxed whitespace-pre-wrap break-words">
                {renderContentWithHashtags(post.content)}
              </p>
            </div>

            {/* Image */}
            {post.image_url && (
              <motion.img
                src={post.image_url}
                alt=""
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 rounded-2xl border border-border max-h-[512px] w-full object-cover"
              />
            )}

            {/* Timestamp */}
            <p className="text-muted-foreground text-sm mt-4 pb-3 border-b border-border">
              {format(new Date(post.created_at), "h:mm a · MMM d, yyyy")}
            </p>

            {/* Engagement stats */}
            {(repostCount > 0 || likeCount > 0) && (
              <div className="flex items-center gap-5 py-3 border-b border-border text-sm">
                {repostCount > 0 && (
                  <span><strong className="text-foreground">{repostCount}</strong> <span className="text-muted-foreground">Reposts</span></span>
                )}
                {likeCount > 0 && (
                  <span><strong className="text-foreground">{likeCount}</strong> <span className="text-muted-foreground">Likes</span></span>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-around py-2 border-b border-border">
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10">
                <MessageCircle className="h-5 w-5" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-green-500 transition-colors rounded-full hover:bg-green-500/10">
                <Repeat2 className="h-5 w-5" />
              </button>
              <button
                onClick={toggleLike}
                className={`p-2 transition-colors rounded-full ${liked ? "text-pink-500 hover:bg-pink-500/10" : "text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10"}`}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
              </button>
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10">
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Reply composer */}
          <PostComposer onPostCreated={fetchPost} parentId={post.id} placeholder={`Reply to @${handle}...`} />
        </motion.div>

        {/* Replies */}
        <AnimatePresence>
          {replies.map((reply, i) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <PostCard
                post={reply}
                authorName={replyProfiles[reply.user_id]?.display_name || undefined}
                authorUsername={replyProfiles[reply.user_id]?.username || undefined}
                authorAvatar={replyProfiles[reply.user_id]?.avatar_url}
                onRefresh={fetchPost}
                onClick={() => navigate(`/post/${reply.id}`)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {replies.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary/40" />
            <p className="text-sm">No replies yet. Be the first to respond!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
