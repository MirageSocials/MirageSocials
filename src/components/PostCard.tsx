import { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat2, Share, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    parent_id?: string | null;
    image_url?: string | null;
  };
  authorName?: string;
  authorUsername?: string;
  onRefresh?: () => void;
  onClick?: () => void;
}

const PostCard = ({ post, authorName, authorUsername, onRefresh, onClick }: PostCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);

  useEffect(() => {
    // Fetch like count and user's like status
    const fetchLikes = async () => {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);
      setLikeCount(count || 0);

      if (user) {
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .maybeSingle();
        setLiked(!!data);
      }
    };

    const fetchReplies = async () => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("parent_id", post.id);
      setReplyCount(count || 0);
    };

    fetchLikes();
    fetchReplies();
  }, [post.id, user]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (liked) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", user.id);
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, post_id: post.id } as any);
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || user.id !== post.user_id) return;
    await supabase.from("posts").delete().eq("id", post.id);
    onRefresh?.();
  };

  const displayName = authorName || "User";
  const handle = authorUsername || post.user_id.slice(0, 8);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: false });

  return (
    <article
      onClick={onClick}
      className="border-b border-border px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
          {displayName[0]?.toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-bold text-foreground truncate">{displayName}</span>
            <span className="text-muted-foreground truncate">@{handle}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground shrink-0">{timeAgo}</span>
          </div>

          {/* Content */}
          <p className="text-foreground text-[15px] leading-relaxed mt-1 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {post.image_url && (
            <img src={post.image_url} alt="" className="mt-3 rounded-2xl border border-border max-h-96 w-full object-cover" />
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            <button
              onClick={(e) => { e.stopPropagation(); onClick?.(); }}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </div>
              {replyCount > 0 && <span className="text-xs">{replyCount}</span>}
            </button>

            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-positive transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-positive/10 transition-colors">
                <Repeat2 className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 transition-colors group ${
                liked ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"
              }`}
            >
              <div className="p-1.5 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              </div>
              {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
            </button>

            <button className="text-muted-foreground hover:text-primary transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                <Share className="h-4 w-4" />
              </div>
            </button>

            {user?.id === post.user_id && (
              <button
                onClick={handleDelete}
                className="text-muted-foreground hover:text-destructive transition-colors group"
              >
                <div className="p-1.5 rounded-full group-hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
