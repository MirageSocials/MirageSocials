import { useEffect, useRef, useState } from "react";
import { X, Maximize2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";

const MiniPlayer = () => {
  const { videoId, videoTitle, isMini, closePlayer, minimizePlayer, playVideo } = useVideoPlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMini) closePlayer();
        else if (videoId && location.pathname === "/watch") minimizePlayer();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMini, videoId, closePlayer, minimizePlayer, location.pathname]);

  if (!videoId || !isMini || location.pathname === "/watch") return null;

  const startDrag = (cx: number, cy: number) => {
    dragging.current = true;
    startPos.current = { x: cx, y: cy, ox: pos.x, oy: pos.y };
  };
  const moveDrag = (cx: number, cy: number) => {
    if (!dragging.current) return;
    setPos({
      x: startPos.current.ox + (cx - startPos.current.x),
      y: startPos.current.oy + (cy - startPos.current.y),
    });
  };
  const endDrag = () => { dragging.current = false; };

  const handleMaximize = () => {
    playVideo(videoId, videoTitle);
    navigate(`/watch?v=${videoId}`);
  };

  return (
    <div
      className="fixed z-[100] shadow-2xl rounded-lg overflow-hidden border border-border bg-background w-[280px] sm:w-[360px]"
      style={{
        bottom: `${16 - pos.y}px`,
        right: `${16 - pos.x}px`,
        touchAction: "none",
      }}
      onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
      onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={(e) => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }}
      onTouchMove={(e) => { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }}
      onTouchEnd={endDrag}
    >
      {/* Controls */}
      <div className="absolute top-1 right-1 z-10 flex gap-1">
        <button onClick={handleMaximize} className="p-1 rounded bg-background/80 hover:bg-secondary text-foreground">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
        <button onClick={closePlayer} className="p-1 rounded bg-background/80 hover:bg-destructive/80 text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      <div className="px-2 py-1.5 truncate text-xs text-muted-foreground">{videoTitle}</div>
    </div>
  );
};

export default MiniPlayer;
