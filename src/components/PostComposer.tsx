import { useState } from "react";
import { Image, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface PostComposerProps {
  onPostCreated?: () => void;
  parentId?: string;
  placeholder?: string;
}

const PostComposer = ({ onPostCreated, parentId, placeholder = "What's happening?" }: PostComposerProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId || null,
    } as any);
    if (error) {
      toast.error("Failed to post");
    } else {
      setContent("");
      onPostCreated?.();
    }
    setLoading(false);
  };

  return (
    <div className="border-b border-border p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={280}
        rows={3}
        className="w-full bg-transparent text-foreground text-lg placeholder:text-muted-foreground resize-none focus:outline-none"
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3 text-primary">
          <button className="hover:bg-primary/10 p-2 rounded-full transition-colors">
            <Image className="h-5 w-5" />
          </button>
          <button className="hover:bg-primary/10 p-2 rounded-full transition-colors">
            <Smile className="h-5 w-5" />
          </button>
          <span className="text-xs text-muted-foreground">{content.length}/280</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-40"
        >
          {parentId ? "Reply" : "Post"}
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
