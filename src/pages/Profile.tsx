import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PostCard from "@/components/PostCard";
import { CalendarDays, Camera } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setProfile(data);
      setEditName(data.display_name || "");
      setEditBio((data as any).bio || "");
      setEditUsername((data as any).username || "");
    }

    const { data: postData } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .is("parent_id", null)
      .order("created_at", { ascending: false });
    if (postData) setPosts(postData);

    const { count: followers } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", user.id);
    setFollowerCount(followers || 0);

    const { count: following } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", user.id);
    setFollowingCount(following || 0);
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      setUploadingAvatar(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ avatar_url: `${urlData.publicUrl}?t=${Date.now()}` } as any)
      .eq("user_id", user.id);

    toast.success("Avatar updated!");
    setUploadingAvatar(false);
    fetchProfile();
  };

  const saveProfile = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({
        display_name: editName,
        bio: editBio,
        username: editUsername,
      } as any)
      .eq("user_id", user.id);
    setEditing(false);
    fetchProfile();
  };

  if (!profile) return (
    <AppLayout>
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </AppLayout>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-xl mx-auto">
        {/* Banner */}
        <div className="h-48 bg-secondary" />

        {/* Profile header */}
        <div className="px-4 pb-4 border-b border-border">
          <div className="flex justify-between items-start -mt-16 mb-3">
            <div className="relative group">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-background object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-card border-4 border-background flex items-center justify-center text-4xl font-bold text-muted-foreground">
                  {(profile.display_name || "U")[0]?.toUpperCase()}
                </div>
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                {uploadingAvatar ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </button>
            </div>
            <button
              onClick={() => editing ? saveProfile() : setEditing(true)}
              className="mt-20 px-4 py-1.5 rounded-full border border-border text-sm font-bold text-foreground hover:bg-secondary transition-colors"
            >
              {editing ? "Save" : "Edit profile"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Display name"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              />
              <input
                value={editUsername}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z]/g, "");
                  setEditUsername(val);
                }}
                placeholder="Username (a-z only)"
                maxLength={20}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              />
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Bio"
                rows={3}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none"
              />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-foreground">{profile.display_name || "User"}</h1>
              <p className="text-muted-foreground text-sm">@{(profile as any).username || user?.id?.slice(0, 8)}</p>
              {(profile as any).bio && (
                <p className="text-foreground text-sm mt-2">{(profile as any).bio}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Joined {format(new Date(profile.created_at), "MMMM yyyy")}
                </div>
              </div>
              <div className="flex gap-4 mt-2 text-sm">
                <span>
                  <strong className="text-foreground">{followingCount}</strong>{" "}
                  <span className="text-muted-foreground">Following</span>
                </span>
                <span>
                  <strong className="text-foreground">{followerCount}</strong>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* User's posts */}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authorName={profile.display_name}
            authorUsername={(profile as any).username}
            authorAvatar={profile.avatar_url}
            onRefresh={fetchProfile}
          />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No posts yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
