import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Play, Minimize2, ArrowLeft } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";

interface VideoItem {
  url: string;
  title: string;
  thumbnail: string;
  uploaderName: string;
  views: number;
}

const PROXY_BASE = `https://irhijsuiezibqcjptbnb.supabase.co/functions/v1/youtube-proxy`;

const Watch = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const videoId = params.get("v");
  const { playVideo, minimizePlayer } = useVideoPlayer();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (videoId) {
      playVideo(videoId, "");
    }
  }, [videoId, playVideo]);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${PROXY_BASE}?path=/trending?region=US`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setVideos(
          data.map((v: any) => ({
            url: `/watch?v=${v.videoId}`,
            title: v.title,
            thumbnail: `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`,
            uploaderName: v.author || "",
            views: v.viewCount || 0,
          }))
        );
      }
    } catch {
      /* fail silently */
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${PROXY_BASE}?path=/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setVideos(
          data
            .filter((v: any) => v.type === "video")
            .map((v: any) => ({
              url: `/watch?v=${v.videoId}`,
              title: v.title,
              thumbnail: `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`,
              uploaderName: v.author || "",
              views: v.viewCount || 0,
            }))
        );
      }
    } catch {
      /* fail silently */
    } finally {
      setLoading(false);
    }
  };

  const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  // Watching a video
  if (videoId) {
    return (
      <AppLayout wide>
        <div className="max-w-5xl mx-auto py-4 space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/watch")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { minimizePlayer(); navigate("/feed"); }}>
              <Minimize2 className="h-4 w-4 mr-1" /> Mini Player
            </Button>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  // Browse / search
  return (
    <AppLayout wide>
      <div className="max-w-6xl mx-auto py-4 space-y-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Play className="h-6 w-6 text-primary" /> Watch
        </h1>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="flex gap-2 max-w-xl"
        >
          <Input
            placeholder="Search YouTube…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-muted animate-pulse aspect-video" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((v, i) => (
              <button
                key={i}
                onClick={() => navigate(v.url)}
                className="group text-left rounded-xl overflow-hidden border border-border hover:border-primary/40 bg-card transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{v.title}</p>
                  <p className="text-xs text-muted-foreground">{v.uploaderName} · {fmtViews(v.views)} views</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Watch;
