import React, { useRef, useState } from 'react';
import {
  ExternalLink,
  Music,
  Grid2X2,
  Share2,
  Check,
  Sparkles,
  Play,
  Flame,
  Info,
  Radio,
} from 'lucide-react';
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'music' | 'trending'>('all');

  const embedSrc = getEmbedUrl(currentVideo);
  const directYoutubeUrl = currentVideo.youtubeId
    ? `https://www.youtube.com/watch?v=${currentVideo.youtubeId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(currentVideo.title)}`;
  const directMusicUrl = currentVideo.youtubeId
    ? `https://music.youtube.com/watch?v=${currentVideo.youtubeId}`
    : `https://music.youtube.com/search?q=${encodeURIComponent(currentVideo.title)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directYoutubeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const filteredPlaylist = playlist.filter((v) => {
    if (filterType === 'music') return v.category?.includes('Musica') || v.category?.includes('Pop') || v.category?.includes('Studio');
    if (filterType === 'trending') return true;
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main Theater Video Stage (Left 8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        {/* 16:9 Video Player Box */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl ambient-glow">
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

        {/* Video Title */}
        <div className="space-y-3 pt-1">
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
            {currentVideo.title}
          </h1>

          {/* Channel Bar & Action Group (YouTube Desktop Style) */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-800/80">
            {/* Channel Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-white text-sm">
                  {currentVideo.channel.slice(0, 1).toUpperCase()}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-slate-100 text-sm hover:text-red-400 transition-colors">
                    {currentVideo.channel}
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  <span className="text-xs text-slate-400 font-medium">Ufficiale</span>
                </div>
                <p className="text-xs text-slate-400">Canale YouTube Verificato</p>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {onOpenMultiView && (
                <button
                  onClick={onOpenMultiView}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs transition-all shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer"
                  title="Dividi lo schermo fino a 4 video contemporanei"
                >
                  <Grid2X2 className="w-4 h-4" />
                  <span>4 Schermi Divisi</span>
                </button>
              )}

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors"
                title="Copia link video"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiato!' : 'Condividi'}</span>
              </button>

              <a
                href={directYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href={directMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/50 text-xs font-medium transition-colors"
              >
                <Music className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Music</span>
              </a>
            </div>
          </div>

          {/* Description & Metadata Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
              <span className="text-white font-semibold">{currentVideo.duration}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Categoria: {currentVideo.category || 'Musica & Intrattenimento'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Riproduzione ad alta definizione
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Stai riproducendo <strong className="text-slate-200">{currentVideo.title}</strong> di <strong className="text-slate-200">{currentVideo.channel}</strong> tramite lo streaming ufficiale di KoreTube.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested & Up Next Column (Right 4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Header & Filter Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Video Correlati & Consigliati</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">{filteredPlaylist.length} video</span>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Tutti
            </button>
            <button
              onClick={() => setFilterType('music')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterType === 'music'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Musica
            </button>
            <button
              onClick={() => setFilterType('trending')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterType === 'trending'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Trend
            </button>
          </div>
        </div>

        {/* Video List (Compact YouTube Cards) */}
        <div className="space-y-2.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {filteredPlaylist.map((video) => {
            const isPlaying = video.youtubeId === currentVideo.youtubeId;
            return (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className={`group flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer border ${
                  isPlaying
                    ? 'bg-slate-900 border-red-500/80 shadow-md ring-1 ring-red-500/40'
                    : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                {/* Horizontal Thumbnail */}
                <div className="relative w-28 h-18 sm:w-32 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-slate-900 shadow-inner">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white">
                    {video.duration}
                  </span>

                  {isPlaying && (
                    <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center backdrop-blur-[1px]">
                      <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="min-w-0 flex-1 space-y-1">
                  <h4
                    className={`text-xs font-semibold line-clamp-2 leading-snug group-hover:text-red-400 transition-colors ${
                      isPlaying ? 'text-red-400' : 'text-slate-200'
                    }`}
                    title={video.title}
                  >
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{video.channel}</p>
                  {video.category && (
                    <span className="text-[10px] text-slate-500 block truncate">
                      {video.category}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
