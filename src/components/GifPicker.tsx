import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface GifPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

const TENOR_KEY = "AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ"; // Public Tenor API key

const GifPicker = ({ onSelect, onClose }: GifPickerProps) => {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<{ id: string; url: string; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    // Load trending on mount
    fetchGifs("");
  }, []);

  const fetchGifs = async (searchQuery: string) => {
    setLoading(true);
    try {
      const endpoint = searchQuery.trim()
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchQuery)}&key=${TENOR_KEY}&limit=20&media_filter=gif`
        : `https://tenor.googleapis.com/v2/featured?key=${TENOR_KEY}&limit=20&media_filter=gif`;
      
      const res = await fetch(endpoint);
      const data = await res.json();
      const results = (data.results || []).map((g: any) => ({
        id: g.id,
        url: g.media_formats?.gif?.url || g.media_formats?.mediumgif?.url || "",
        preview: g.media_formats?.tinygif?.url || g.media_formats?.nanogif?.url || "",
      }));
      setGifs(results);
    } catch {
      setGifs([]);
    }
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchGifs(value), 400);
  };

  return (
    <div ref={ref} className="absolute top-10 left-0 z-50 w-72 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search GIFs..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          autoFocus
        />
        <button onClick={onClose} className="p-1 hover:bg-secondary rounded-md transition-colors">
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
      <div className="h-64 overflow-y-auto p-1.5">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        ) : gifs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            No GIFs found
          </div>
        ) : (
          <div className="columns-2 gap-1.5">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                onClick={() => { onSelect(gif.url); onClose(); }}
                className="w-full mb-1.5 rounded-lg overflow-hidden hover:opacity-80 transition-opacity block"
              >
                <img src={gif.preview} alt="" className="w-full rounded-lg" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-border px-2 py-1">
        <span className="text-[10px] text-muted-foreground font-mono">Powered by Tenor</span>
      </div>
    </div>
  );
};

export default GifPicker;
