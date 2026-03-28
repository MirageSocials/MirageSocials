import React, { createContext, useContext, useState, useCallback } from "react";

interface VideoPlayerState {
  videoId: string | null;
  videoTitle: string;
  isMini: boolean;
}

interface VideoPlayerContextValue extends VideoPlayerState {
  playVideo: (id: string, title?: string) => void;
  minimizePlayer: () => void;
  closePlayer: () => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null);

export const VideoPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<VideoPlayerState>({ videoId: null, videoTitle: "", isMini: false });

  const playVideo = useCallback((id: string, title = "") => {
    setState({ videoId: id, videoTitle: title, isMini: false });
  }, []);

  const minimizePlayer = useCallback(() => {
    setState((s) => ({ ...s, isMini: true }));
  }, []);

  const closePlayer = useCallback(() => {
    setState({ videoId: null, videoTitle: "", isMini: false });
  }, []);

  return (
    <VideoPlayerContext.Provider value={{ ...state, playVideo, minimizePlayer, closePlayer }}>
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => {
  const ctx = useContext(VideoPlayerContext);
  if (!ctx) throw new Error("useVideoPlayer must be inside VideoPlayerProvider");
  return ctx;
};
