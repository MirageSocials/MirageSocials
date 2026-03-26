import { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat2, Bookmark, Trash2, Quote } from "lucide-react";
import PollDisplay from "./PollDisplay";
import TipButton from "./TipButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
  poll_expires_at?: string | null;
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
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const [reposted, setReposted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
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

      if (user) {
        const [{ data: rp }, { data: bm }] = await Promise.all([
          supabase.from("posts").select("id").eq("repost_id", post.id).eq("user_id", user.id).maybeSingle(),
          supabase.from("bookmarks").select("id").eq("post_id", post.id).eq("user_id", user.id).maybeSingle(),
        ]);
        setReposted(!!rp);
        setBookmarked(!!bm);
      }
    };

    fetchCounts();
  }, [post.id, user]);

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

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("post_id", post.id).eq("user_id", user.id);
      setBookmarked(false);
      toast("Bookmark removed");
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, post_id: post.id } as any);
      setBookmarked(true);
      toast("Added to bookmarks");
    }
  };

  const goToUserProfile = (e: React.MouseEvent, uid: string) => {
    e.stopPropagation();
    navigate(`/user/${uid}`);
  };

  const displayName = authorName || "User";
  const handle = authorUsername || post.user_id.slice(0, 8);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: false });

  const Avatar = ({ url, name, uid, size = "w-10 h-10" }: { url?: string | null; name: string; uid: string; size?: string }) => (
    url ? (
      <img onClick={(e) => goToUserProfile(e, uid)} src={url} alt="" className={`${size} rounded-lg object-cover shrink-0 cursor-pointer hover:opacity-80 transition-opacity ring-1 ring-border`} />
    ) : (
      <div onClick={(e) => goToUserProfile(e, uid)} className={`${size} rounded-lg bg-primary/15 flex items-center justify-center shrink-0 text-sm font-bold font-mono text-primary cursor-pointer hover:opacity-80 transition-opacity`}>
        {name[0]?.toUpperCase()}
      </div>
    )
  );

  const EmbeddedPost = ({ op, author }: { op: PostData; author: { display_name: string | null; username: string | null; avatar_url: string | null } | null }) => (
    <div className="mt-3 border border-border rounded-xl p-3 hover:bg-secondary/20 transition-colors">
      <div className="flex items-center gap-2 text-sm">
        <Avatar url={author?.avatar_url} name={author?.display_name || "U"} uid={op.user_id} size="w-5 h-5" />
        <span className="font-semibold text-foreground truncate text-xs">{author?.display_name || "User"}</span>
        <span className="text-muted-foreground truncate text-xs font-mono">@{author?.username || op.user_id.slice(0, 8)}</span>
      </div>
      <p className="text-foreground text-sm mt-1.5 whitespace-pre-wrap break-words leading-relaxed">{renderContentWithHashtags(op.content)}</p>
      {op.image_url && (
        <img src={op.image_url} alt="" className="mt-2 rounded-lg border border-border max-h-48 w-full object-cover" />
      )}
    </div>
  );

  const isPureRepost = post.repost_id && !post.content;

  return (
    <>
      <article
        onClick={onClick}
        className="border-b border-border px-4 py-3 hover:bg-secondary/20 transition-all cursor-pointer group/post"
      >
        {isPureRepost && (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2 ml-12 font-mono">
            <Repeat2 className="h-3 w-3" />
            <span>{displayName} reposted</span>
          </div>
        )}

        {isPureRepost && originalPost ? (
          <div className="flex gap-3">
            <Avatar url={originalAuthor?.avatar_url} name={originalAuthor?.display_name || "U"} uid={originalPost.user_id} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-sm">
                <span onClick={(e) => goToUserProfile(e, originalPost.user_id)} className="font-semibold text-foreground truncate cursor-pointer hover:underline">{originalAuthor?.display_name || "User"}</span>
                <span onClick={(e) => goToUserProfile(e, originalPost.user_id)} className="text-muted-foreground truncate cursor-pointer hover:underline font-mono text-xs">@{originalAuthor?.username || originalPost.user_id.slice(0, 8)}</span>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-muted-foreground shrink-0 text-xs">{formatDistanceToNow(new Date(originalPost.created_at), { addSuffix: false })}</span>
              </div>
              <p className="text-foreground text-[15px] leading-relaxed mt-1 whitespace-pre-wrap break-words">{renderContentWithHashtags(originalPost.content)}</p>
               {originalPost.image_url && (
                 <img src={originalPost.image_url} alt="" className="mt-3 rounded-xl border border-border max-h-96 w-full object-cover" />
               )}
               <PollDisplay postId={originalPost.id} expiresAt={originalPost.poll_expires_at} />
               <ActionButtons />
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Avatar url={authorAvatar} name={displayName} uid={post.user_id} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-sm">
                <span onClick={(e) => goToUserProfile(e, post.user_id)} className="font-semibold text-foreground truncate cursor-pointer hover:underline">{displayName}</span>
                <span onClick={(e) => goToUserProfile(e, post.user_id)} className="text-muted-foreground truncate cursor-pointer hover:underline font-mono text-xs">@{handle}</span>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-muted-foreground shrink-0 text-xs">{timeAgo}</span>
              </div>
              <p className="text-foreground text-[15px] leading-relaxed mt-1 whitespace-pre-wrap break-words">{renderContentWithHashtags(post.content)}</p>
              {post.image_url && (
                <img src={post.image_url} alt="" className="mt-3 rounded-xl border border-border max-h-96 w-full object-cover" />
              )}
              <PollDisplay postId={post.id} expiresAt={post.poll_expires_at} />
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
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={quoteContent}
              onChange={(e) => setQuoteContent(e.target.value)}
              placeholder="Add a comment..."
              maxLength={280}
              rows={3}
              className="w-full bg-transparent text-foreground text-base placeholder:text-muted-foreground resize-none focus:outline-none"
              autoFocus
            />
            <div className="border border-border rounded-xl p-3 mt-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground text-xs">{displayName}</span>
                <span className="text-muted-foreground font-mono text-xs">@{handle}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{post.content}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground font-mono">{quoteContent.length}/280</span>
              <button
                onClick={submitQuote}
                disabled={!quoteContent.trim()}
                className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2 rounded-lg hover:brightness-110 transition-all disabled:opacity-40"
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
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-primary/10 transition-colors">
            <MessageCircle className="h-[15px] w-[15px]" />
          </div>
          {replyCount > 0 && <span className="text-[11px] font-mono">{replyCount}</span>}
        </button>

        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowRepostMenu(!showRepostMenu); }}
            className={`flex items-center gap-1 transition-colors group ${reposted ? "text-positive" : "text-muted-foreground hover:text-positive"}`}
          >
            <div className="p-1.5 rounded-lg group-hover:bg-positive/10 transition-colors">
              <Repeat2 className="h-[15px] w-[15px]" />
            </div>
            {repostCount > 0 && <span className="text-[11px] font-mono">{repostCount}</span>}
          </button>

          {showRepostMenu && (
            <div className="absolute bottom-full left-0 mb-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 w-36"
              onClick={(e) => e.stopPropagation()}>
              <button onClick={handleRepost} className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-foreground hover:bg-secondary transition-colors">
                <Repeat2 className="h-3.5 w-3.5" />
                {reposted ? "Undo" : "Repost"}
              </button>
              <button onClick={handleQuotePost} className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-foreground hover:bg-secondary transition-colors">
                <Quote className="h-3.5 w-3.5" />
                Quote
              </button>
            </div>
          )}
        </div>

        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 transition-colors group ${liked ? "text-negative" : "text-muted-foreground hover:text-negative"}`}
        >
          <div className="p-1.5 rounded-lg group-hover:bg-negative/10 transition-colors">
            <Heart className={`h-[15px] w-[15px] ${liked ? "fill-current" : ""}`} />
          </div>
          {likeCount > 0 && <span className="text-[11px] font-mono">{likeCount}</span>}
        </button>

        <TipButton postId={post.id} recipientId={post.user_id} />

        <button
          onClick={toggleBookmark}
          className={`transition-colors group ${bookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          <div className="p-1.5 rounded-lg group-hover:bg-primary/10 transition-colors">
            <Bookmark className={`h-[15px] w-[15px] ${bookmarked ? "fill-current" : ""}`} />
          </div>
        </button>

        {user?.id === post.user_id && (
          <button onClick={handleDelete} className="text-muted-foreground hover:text-destructive transition-colors group">
            <div className="p-1.5 rounded-lg group-hover:bg-destructive/10 transition-colors">
              <Trash2 className="h-[15px] w-[15px]" />
            </div>
          </button>
        )}
      </div>
    );
  }
};

export default PostCard;
