import { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat2, Share, Trash2, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { renderContentWithHashtags } from "@/lib/hashtags";

interface PostData {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id?: string | null;
  image_url?: string | null;
  repost_id?: string | null;
}

interface PostCardProps {
  post: PostData;
  authorName?: string;
  authorUsername?: string;
  authorAvatar?: string | null;
  onRefresh?: () => void;
  onClick?: () => void;
}

const PostCard = ({ post, authorName, authorUsername, authorAvatar, onRefresh, onClick }: PostCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const [reposted, setReposted] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteContent, setQuoteContent] = useState("");
  const [showRepostMenu, setShowRepostMenu] = useState(false);
  const [originalPost, setOriginalPost] = useState<PostData | null>(null);
  const [originalAuthor, setOriginalAuthor] = useState<{ display_name: string | null; username: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ count: likes }, { data: userLike }, { count: replies }, { count: reposts }] = await Promise.all([
        supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", post.id),
        user ? supabase.from("likes").select("id").eq("post_id", post.id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("parent_id", post.id),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("repost_id", post.id),
      ]);
      setLikeCount(likes || 0);
      setLiked(!!userLike);
      setReplyCount(replies || 0);
      setRepostCount(reposts || 0);

      // Check if user reposted
      if (user) {
        const { data: rp } = await supabase
          .from("posts")
          .select("id")
          .eq("repost_id", post.id)
          .eq("user_id", user.id)
          .maybeSingle();
        setReposted(!!rp);
      }
    };

    fetchCounts();
  }, [post.id, user]);

  // Fetch original post if this is a repost
  useEffect(() => {
    if (!post.repost_id) return;
    const fetchOriginal = async () => {
      const { data } = await supabase.from("posts").select("*").eq("id", post.repost_id!).single();
      if (data) {
        setOriginalPost(data as PostData);
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, username, avatar_url")
          .eq("user_id", data.user_id)
          .single();
        if (profile) setOriginalAuthor(profile);
      }
    };
    fetchOriginal();
  }, [post.repost_id]);

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
      if (post.user_id !== user.id) {
        await supabase.from("notifications").insert({
          user_id: post.user_id, actor_id: user.id, type: "like", post_id: post.id,
        } as any);
      }
    }
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (reposted) {
      // Undo repost
      await supabase.from("posts").delete().eq("repost_id", post.id).eq("user_id", user.id);
      setReposted(false);
      setRepostCount((c) => c - 1);
      toast("Repost removed");
    } else {
      await supabase.from("posts").insert({
        user_id: user.id, content: "", repost_id: post.id,
      } as any);
      setReposted(true);
      setRepostCount((c) => c + 1);
      toast("Reposted!");
    }
    setShowRepostMenu(false);
    onRefresh?.();
  };

  const handleQuotePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRepostMenu(false);
    setShowQuoteModal(true);
  };

  const submitQuote = async () => {
    if (!user || !quoteContent.trim()) return;
    await supabase.from("posts").insert({
      user_id: user.id, content: quoteContent.trim(), repost_id: post.id,
    } as any);
    setRepostCount((c) => c + 1);
    setQuoteContent("");
    setShowQuoteModal(false);
    toast("Quote posted!");
    onRefresh?.();
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

  // Embedded original post for quote/repost
  const EmbeddedPost = ({ op, author }: { op: PostData; author: { display_name: string | null; username: string | null; avatar_url: string | null } | null }) => (
    <div className="mt-3 border border-border rounded-2xl p-3 hover:bg-secondary/20 transition-colors">
      <div className="flex items-center gap-2 text-sm">
        {author?.avatar_url ? (
          <img src={author.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
            {(author?.display_name || "U")[0]?.toUpperCase()}
          </div>
        )}
        <span className="font-bold text-foreground truncate">{author?.display_name || "User"}</span>
        <span className="text-muted-foreground truncate">@{author?.username || op.user_id.slice(0, 8)}</span>
      </div>
      <p className="text-foreground text-sm mt-1 whitespace-pre-wrap break-words">{renderContentWithHashtags(op.content)}</p>
      {op.image_url && (
        <img src={op.image_url} alt="" className="mt-2 rounded-xl border border-border max-h-48 w-full object-cover" />
      )}
    </div>
  );

  // If it's a pure repost (no content), show repost label + embedded original
  const isPureRepost = post.repost_id && !post.content;

  return (
    <>
      <article
        onClick={onClick}
        className="border-b border-border px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer"
      >
        {isPureRepost && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 ml-12">
            <Repeat2 className="h-3.5 w-3.5" />
            <span>{displayName} reposted</span>
          </div>
        )}

        {isPureRepost && originalPost ? (
          // Render the original post as the main content
          <div className="flex gap-3">
            {originalAuthor?.avatar_url ? (
              <img src={originalAuthor.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                {(originalAuthor?.display_name || "U")[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-bold text-foreground truncate">{originalAuthor?.display_name || "User"}</span>
                <span className="text-muted-foreground truncate">@{originalAuthor?.username || originalPost.user_id.slice(0, 8)}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground shrink-0">{formatDistanceToNow(new Date(originalPost.created_at), { addSuffix: false })}</span>
              </div>
              <p className="text-foreground text-[15px] leading-relaxed mt-1 whitespace-pre-wrap break-words">{renderContentWithHashtags(originalPost.content)}</p>
              {originalPost.image_url && (
                <img src={originalPost.image_url} alt="" className="mt-3 rounded-2xl border border-border max-h-96 w-full object-cover" />
              )}
              <ActionButtons />
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            {authorAvatar ? (
              <img src={authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-bold text-foreground truncate">{displayName}</span>
                <span className="text-muted-foreground truncate">@{handle}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground shrink-0">{timeAgo}</span>
              </div>
              <p className="text-foreground text-[15px] leading-relaxed mt-1 whitespace-pre-wrap break-words">{renderContentWithHashtags(post.content)}</p>
              {post.image_url && (
                <img src={post.image_url} alt="" className="mt-3 rounded-2xl border border-border max-h-96 w-full object-cover" />
              )}
              {/* Quote embed */}
              {post.repost_id && post.content && originalPost && (
                <EmbeddedPost op={originalPost} author={originalAuthor} />
              )}
              <ActionButtons />
            </div>
          </div>
        )}
      </article>

      {/* Quote modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowQuoteModal(false)}>
          <div className="bg-background border border-border rounded-2xl w-full max-w-lg p-4" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={quoteContent}
              onChange={(e) => setQuoteContent(e.target.value)}
              placeholder="Add a comment..."
              maxLength={280}
              rows={3}
              className="w-full bg-transparent text-foreground text-lg placeholder:text-muted-foreground resize-none focus:outline-none"
              autoFocus
            />
            {/* Embedded preview */}
            <div className="border border-border rounded-2xl p-3 mt-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-foreground">{displayName}</span>
                <span className="text-muted-foreground">@{handle}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{post.content}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">{quoteContent.length}/280</span>
              <button
                onClick={submitQuote}
                disabled={!quoteContent.trim()}
                className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  function ActionButtons() {
    return (
      <div className="flex items-center justify-between mt-3 max-w-md relative">
        <button
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
        >
          <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
            <MessageCircle className="h-4 w-4" />
          </div>
          {replyCount > 0 && <span className="text-xs">{replyCount}</span>}
        </button>

        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowRepostMenu(!showRepostMenu); }}
            className={`flex items-center gap-1.5 transition-colors group ${reposted ? "text-green-500" : "text-muted-foreground hover:text-green-500"}`}
          >
            <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
              <Repeat2 className="h-4 w-4" />
            </div>
            {repostCount > 0 && <span className="text-xs">{repostCount}</span>}
          </button>

          {showRepostMenu && (
            <div className="absolute bottom-full left-0 mb-1 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 w-40"
              onClick={(e) => e.stopPropagation()}>
              <button onClick={handleRepost} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                <Repeat2 className="h-4 w-4" />
                {reposted ? "Undo repost" : "Repost"}
              </button>
              <button onClick={handleQuotePost} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                <Quote className="h-4 w-4" />
                Quote
              </button>
            </div>
          )}
        </div>

        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 transition-colors group ${liked ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"}`}
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
          <button onClick={handleDelete} className="text-muted-foreground hover:text-destructive transition-colors group">
            <div className="p-1.5 rounded-full group-hover:bg-destructive/10 transition-colors">
              <Trash2 className="h-4 w-4" />
            </div>
          </button>
        )}
      </div>
    );
  }
};

export default PostCard;
