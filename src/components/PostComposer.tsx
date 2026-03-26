import { useState, useRef, useEffect } from "react";
import { Image, Smile, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface PostComposerProps {
  onPostCreated?: () => void;
  parentId?: string;
  placeholder?: string;
}

const PostComposer = ({ onPostCreated, parentId, placeholder = "What's happening?" }: PostComposerProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiSelect = (emoji: any) => {
    if (content.length + emoji.native.length <= 280) {
      setContent((prev) => prev + emoji.native);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !imageFile) || !user) return;
    setLoading(true);

    let image_url: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, imageFile);
      if (uploadError) {
        toast.error("Failed to upload image");
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    const { data: postData, error } = await supabase.from("posts").insert({
      user_id: user.id,
      content: content.trim() || "",
      parent_id: parentId || null,
      image_url,
    } as any).select().single();

    if (error) {
      toast.error("Failed to post");
    } else {
      if (parentId && postData) {
        const { data: parentPost } = await supabase.from("posts").select("user_id").eq("id", parentId).single();
        if (parentPost && parentPost.user_id !== user.id) {
          await supabase.from("notifications").insert({
            user_id: parentPost.user_id,
            actor_id: user.id,
            type: "reply",
            post_id: parentId,
          } as any);
        }
      }
      setContent("");
      removeImage();
      setShowEmojiPicker(false);
      onPostCreated?.();
    }
    setLoading(false);
  };

  const remaining = 280 - content.length;

  return (
    <div className={`border-b border-border p-4 transition-colors ${focused ? "bg-secondary/20" : ""}`}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        maxLength={280}
        rows={focused || content ? 3 : 1}
        className="w-full bg-transparent text-foreground text-[15px] placeholder:text-muted-foreground resize-none focus:outline-none transition-all"
      />

      {imagePreview && (
        <div className="relative mt-2 inline-block">
          <img src={imagePreview} alt="Preview" className="max-h-48 rounded-xl border border-border" />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg p-1 hover:bg-background transition-colors"
          >
            <X className="h-3.5 w-3.5 text-foreground" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1 text-primary relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hover:bg-primary/10 p-2 rounded-lg transition-colors"
          >
            <Image className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="hover:bg-primary/10 p-2 rounded-lg transition-colors"
          >
            <Smile className="h-4 w-4" />
          </button>

          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute top-10 left-0 z-50">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" previewPosition="none" skinTonePosition="none" maxFrequentRows={1} />
            </div>
          )}

          <span className={`text-[11px] font-mono ml-1 ${remaining <= 20 ? "text-destructive" : "text-muted-foreground"}`}>{remaining} left</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={(!content.trim() && !imageFile) || loading}
          className="bg-primary text-primary-foreground font-bold text-[13px] px-5 py-1.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-40"
        >
          {parentId ? "Reply" : "Post"}
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
