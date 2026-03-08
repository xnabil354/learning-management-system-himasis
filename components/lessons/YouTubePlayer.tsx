"use client";

import { VideoOff } from "lucide-react";

interface YouTubePlayerProps {
  videoUrl: string | null | undefined;
  title?: string;
  className?: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function YouTubePlayer({
  videoUrl,
  title,
  className,
}: YouTubePlayerProps) {
  if (!videoUrl) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No video available</p>
        </div>
      </div>
    );
  }

  const videoId = extractYouTubeId(videoUrl);

  if (!videoId) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">Invalid YouTube URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title ?? "Lesson video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full aspect-video rounded-xl overflow-hidden border-0"
      />
    </div>
  );
}
