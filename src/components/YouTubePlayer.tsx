import React, { useRef } from 'react';
import { ExternalLink, Music, Grid2X2 } from 'lucide-react';
import { VideoItem } from '../types';
import { getEmbedUrl } from '../services/youtubeSearch';

interface YouTubePlayerProps {
  currentVideo: VideoItem;
  onSelectVideo: (video: VideoItem) => void;
  playlist: VideoItem[];
  onOpenMultiView?: () => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  currentVideo,
  onSelectVideo,
  playlist,
  onOpenMultiView,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedSrc = getEmbedUrl(currentVideo);
  const directYoutubeUrl = currentVideo.youtubeId
    ? `https://www.youtube.com/watch?v=${currentVideo.youtubeId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(currentVideo.title)}`;
  const directMusicUrl = currentVideo.youtubeId
    ? `https://music.youtube.com/watch?v=${currentVideo.youtubeId}`
    : `https://music.youtube.com/search?q=${encodeURIComponent(currentVideo.title)}`;

  return (
    <div className="space-y-6">
      {/* Video & Info Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Main 16:9 Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            ref={iframeRef}
            src={embedSrc}
            title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full border-0"
          />
        </div>

        {/* Video Metadata Bar (YouTube Style) */}
        <div className="p-5 bg-slate-950/70 border-b border-slate-800 space-y-3">
          <h1 className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
            {currentVideo.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Channel info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-sm shrink-0">
                {currentVideo.channel.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{currentVideo.channel}</p>
                <p className="text-xs text-slate-400">YouTube Official Player</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {onOpenMultiView && (
                <button
                  onClick={onOpenMultiView}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                  title="Apri modalità Multiview (fino a 4 video)"
                >
                  <Grid2X2 className="w-3.5 h-3.5 text-red-400" />
                  <span>4 Schermi Divisi</span>
                </button>
              )}

              <a
                href={directYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={directMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-medium transition-colors"
              >
                <Music className="w-3.5 h-3.5 text-red-400" />
                <span>YouTube Music</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested / Up Next Videos */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Video Consigliati
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {playlist.map((video) => {
            const isCurrent = video.youtubeId === currentVideo.youtubeId;
            return (
              <button
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all border ${
                  isCurrent
                    ? 'bg-slate-800/90 border-red-500/60 shadow-md ring-1 ring-red-500/30'
                    : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-950">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] font-mono text-white">
                    {video.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug">
                    {video.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-1">{video.channel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
