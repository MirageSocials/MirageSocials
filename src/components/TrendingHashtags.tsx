import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TrendingTag {
  tag: string;
  count: number;
}

const TrendingHashtags = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<TrendingTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      // Fetch recent posts and extract hashtags
      const { data } = await supabase
        .from("posts")
        .select("content")
        .order("created_at", { ascending: false })
        .limit(200);

      if (data) {
        const tagCounts: Record<string, number> = {};
        data.forEach((post) => {
          const matches = post.content.match(/#[\w]+/g);
          if (matches) {
            matches.forEach((tag: string) => {
              const lower = tag.toLowerCase();
              tagCounts[lower] = (tagCounts[lower] || 0) + 1;
            });
          }
        });

        const sorted = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);

        setTags(sorted);
      }
      setLoading(false);
    };

    fetchTrending();
  }, []);

  if (loading) return null;
  if (tags.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold text-foreground">Trending</span>
      </div>
      <div className="space-y-1">
        {tags.map((t, i) => (
          <button
            key={t.tag}
            onClick={() => navigate(`/hashtag/${t.tag.slice(1)}`)}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-left group"
          >
            <span className="text-[10px] font-mono text-muted-foreground w-4">{i + 1}</span>
            <Hash className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-colors" />
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors truncate block">
                {t.tag}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {t.count} {t.count === 1 ? "post" : "posts"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingHashtags;
