import React, { useState, useMemo } from 'react';
import { Search, Play, Filter, Music2, CheckCircle2, Flame, Loader2, Compass, Sparkles } from 'lucide-react';
import { VideoItem } from '../types';
import { FEATURED_VIDEOS, POPULAR_SEARCH_SUGGESTIONS, liveSearchYouTube, parseInputOrQuery } from '../services/youtubeSearch';

interface YouTubeSearchPanelProps {
  currentVideo: VideoItem;
  onSelectVideo: (video: VideoItem) => void;
}

const CATEGORIES = ['Tutti', 'Musica Italiana', 'Lo-Fi & Studio', 'Pop & Rock Internazionale', 'Podcast & Show'];

export const YouTubeSearchPanel: React.FC<YouTubeSearchPanelProps> = ({
  currentVideo,
  onSelectVideo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQueryTitle, setActiveQueryTitle] = useState('');

  // Perform live YouTube search
  const executeSearch = async (term: string) => {
    const clean = term.trim();
    if (!clean) return;

    setIsLoading(true);
    setHasSearched(true);
    setActiveQueryTitle(clean);

    try {
      const results = await liveSearchYouTube(clean);
      setSearchResults(results);
    } catch {
      const fallback = parseInputOrQuery(clean);
      setSearchResults([fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    executeSearch(searchQuery);
  };

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    executeSearch(term);
  };

  // Filter catalog videos for default view
  const catalogVideos = useMemo(() => {
    let list = FEATURED_VIDEOS;
    if (selectedCategory !== 'Tutti') {
      list = list.filter((v) => v.category === selectedCategory);
    }
    return list;
  }, [selectedCategory]);

  return (
    <div className="bg-[#090b0e] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl space-y-2">
      {/* Search Header Banner */}
      <div className="p-6 md:p-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950/70 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <Search className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Cerca su YouTube
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Trova e riproduci qualsiasi canzone, playlist o video dal catalogo globale
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ricerca YouTube Live Connessa</span>
          </div>
        </div>

        {/* Big Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca video, brani musicali o artisti..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setHasSearched(false);
                  setSearchResults([]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg transition-colors"
              >
                Cancella
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/30 shrink-0 active:scale-95 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isLoading ? 'Ricerca in corso...' : 'Cerca'}</span>
          </button>
        </form>

        {/* Trending Tags Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
          <span className="text-slate-400 shrink-0 flex items-center gap-1.5 font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Trend:
          </span>
          {POPULAR_SEARCH_SUGGESTIONS.map((term) => (
            <button
              key={term}
              onClick={() => handleSuggestionClick(term)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 shrink-0 transition-all font-medium active:scale-95 cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8 space-y-6">
        {hasSearched ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Risultati YouTube per: <span className="text-white normal-case font-extrabold text-sm">"{activeQueryTitle}"</span>
                </span>
                <span className="text-xs text-emerald-400 font-mono font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                  {searchResults.length} video
                </span>
              </div>

              <button
                onClick={() => {
                  setHasSearched(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                ← Torna al catalogo
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-20 space-y-3">
                <Loader2 className="w-10 h-10 mx-auto animate-spin text-red-500" />
                <p className="text-sm font-semibold text-slate-200">Ricerca su YouTube in corso...</p>
                <p className="text-xs text-slate-400">Recupero video e dettagli per "{activeQueryTitle}"</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults.map((video) => {
                  const isPlaying = currentVideo.youtubeId === video.youtubeId;
                  return (
                    <div
                      key={video.id}
                      onClick={() => onSelectVideo(video)}
                      className={`group rounded-3xl border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-xl ${
                        isPlaying
                          ? 'bg-slate-900 border-red-500 ring-2 ring-red-500/30'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700 hover:-translate-y-1'
                      }`}
                    >
                      <div>
                        {/* Thumbnail with overlay */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-3 shadow-inner">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[10px] font-mono text-white font-semibold">
                            {video.duration}
                          </div>

                          {/* Hover Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </span>
                          </div>

                          {isPlaying && (
                            <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-xl bg-red-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                              <Play className="w-3 h-3 fill-current" />
                              <span>In riproduzione</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Channel */}
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors" title={video.title}>
                          {video.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1.5 truncate font-medium">
                          {video.channel}
                        </p>
                      </div>

                      {/* Play Action Bar */}
                      <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">Video YouTube</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-red-400 group-hover:text-red-300">
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Riproduci</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 space-y-3">
                <Music2 className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">Nessun video trovato per "{activeQueryTitle}".</p>
                <p className="text-xs text-slate-500">Prova con un termine diverso o con il nome dell'artista.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Category filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">Genere:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {catalogVideos.map((video) => {
                const isPlaying = currentVideo.youtubeId === video.youtubeId;
                return (
                  <div
                    key={video.id}
                    onClick={() => onSelectVideo(video)}
                    className={`group rounded-3xl border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-xl ${
                      isPlaying
                        ? 'bg-slate-900 border-red-500 ring-2 ring-red-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700 hover:-translate-y-1'
                    }`}
                  >
                    <div>
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-3 shadow-inner">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[10px] font-mono text-white font-semibold">
                          {video.duration}
                        </div>

                        {/* Hover Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </span>
                        </div>

                        {isPlaying && (
                          <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-xl bg-red-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                            <Play className="w-3 h-3 fill-current" />
                            <span>In riproduzione</span>
                          </div>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-between font-medium">
                        <span>{video.channel}</span>
                        {video.category && <span className="text-slate-500 text-[11px]">{video.category}</span>}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Seleziona video</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-red-400 group-hover:text-red-300">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Riproduci</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
