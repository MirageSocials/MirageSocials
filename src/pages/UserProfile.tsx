import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PostCard from "@/components/PostCard";
import { CalendarDays, UserPlus, UserMinus, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "replies" | "likes">("posts");

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const [{ data: profileData }, { data: postData }, { count: followers }, { count: following }] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
          .is("parent_id", null)
          .order("created_at", { ascending: false }),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
      ]);

    if (profileData) setProfile(profileData);
    if (postData) {
      setPosts(postData);
      const userIds = [...new Set(postData.map((p: any) => p.user_id))];
      if (userIds.length > 0) {
        const { data: pData } = await supabase
          .from("profiles")
          .select("user_id, display_name, username, avatar_url")
          .in("user_id", userIds);
        if (pData) {
          const map: Record<string, any> = {};
          pData.forEach((p: any) => { map[p.user_id] = p; });
          setProfiles(map);
        }
      }
    }
    setFollowerCount(followers || 0);
    setFollowingCount(following || 0);

    if (user && user.id !== userId) {
      const { data: followData } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", userId)
        .maybeSingle();
      setIsFollowing(!!followData);
    }

    setLoading(false);
  }, [userId, user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // If viewing own profile, redirect
  useEffect(() => {
    if (user && userId === user.id) navigate("/profile", { replace: true });
  }, [user, userId, navigate]);

  const toggleFollow = async () => {
    if (!user || !userId) return;
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", userId);
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
      toast("Unfollowed");
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: userId } as any);
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
      toast("Following!");
      await supabase.from("notifications").insert({
        user_id: userId, actor_id: user.id, type: "follow",
      } as any);
    }
  };

  if (loading || !profile) return (
    <AppLayout>
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      {/* Back button */}
      <div className="flex items-center gap-4 px-4 py-3 sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h2 className="font-bold text-foreground text-lg leading-tight">{profile.display_name || "User"}</h2>
            <span className="text-xs text-muted-foreground">{posts.length} posts</span>
          </div>
        </div>

        {/* Banner */}
        {profile.banner_url ? (
          <img src={profile.banner_url} alt="" className="h-48 w-full object-cover" />
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary/30 via-secondary to-accent" />
        )}

        {/* Profile header */}
        <div className="px-4 pb-4 border-b border-border">
          <div className="flex justify-between items-end -mt-16 mb-3">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-28 h-28 rounded-full border-4 border-background object-cover" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-card border-4 border-background flex items-center justify-center text-4xl font-bold text-muted-foreground">
                  {(profile.display_name || "U")[0]?.toUpperCase()}
                </div>
              )}
            </motion.div>

            {user && user.id !== userId && (
              <button
                onClick={toggleFollow}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                  isFollowing
                    ? "border border-border text-foreground hover:border-destructive hover:text-destructive"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                {isFollowing ? <><UserMinus className="h-4 w-4" /> Following</> : <><UserPlus className="h-4 w-4" /> Follow</>}
              </button>
            )}
          </div>

          <h1 className="text-xl font-bold text-foreground">{profile.display_name || "User"}</h1>
          <p className="text-muted-foreground text-sm">@{profile.username || userId?.slice(0, 8)}</p>
          {profile.bio && <p className="text-foreground text-sm mt-2">{profile.bio}</p>}

          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              Joined {format(new Date(profile.created_at), "MMMM yyyy")}
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-sm">
            <span><strong className="text-foreground">{followingCount}</strong> <span className="text-muted-foreground">Following</span></span>
            <span><strong className="text-foreground">{followerCount}</strong> <span className="text-muted-foreground">Followers</span></span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["posts", "replies", "likes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-3.5 text-sm font-medium transition-colors relative capitalize ${
                activeTab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {activeTab === t && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />}
            </button>
          ))}
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authorName={profiles[post.user_id]?.display_name || profile.display_name}
            authorUsername={profiles[post.user_id]?.username || profile.username}
            authorAvatar={profiles[post.user_id]?.avatar_url || profile.avatar_url}
            onRefresh={fetchData}
            onClick={() => navigate(`/post/${post.id}`)}
          />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">No posts yet</div>
        )}
    </AppLayout>
  );
};

export default UserProfile;
