import { useState, useRef } from "react";
import { Image, Smile, X } from "lucide-react";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

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

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      content: content.trim() || "",
      parent_id: parentId || null,
      image_url,
    } as any);

    if (error) {
      toast.error("Failed to post");
    } else {
      setContent("");
      removeImage();
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

      {imagePreview && (
        <div className="relative mt-2 inline-block">
          <img src={imagePreview} alt="Preview" className="max-h-48 rounded-2xl border border-border" />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-background transition-colors"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3 text-primary">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hover:bg-primary/10 p-2 rounded-full transition-colors"
          >
            <Image className="h-5 w-5" />
          </button>
          <button className="hover:bg-primary/10 p-2 rounded-full transition-colors">
            <Smile className="h-5 w-5" />
          </button>
          <span className="text-xs text-muted-foreground">{content.length}/280</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={(!content.trim() && !imageFile) || loading}
          className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-40"
        >
          {parentId ? "Reply" : "Post"}
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
