import React, { useState, useMemo } from 'react';
import { Search, Play, Filter, Music2, CheckCircle2, Flame, Loader2 } from 'lucide-react';
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Search Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-950/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Search className="w-5 h-5 text-red-500" />
              <span>Cerca su YouTube</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Trova e guarda qualsiasi video o canzone direttamente da YouTube
            </p>
          </div>
        </div>

        {/* Big Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca video, brani musicali o canali..."
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setHasSearched(false);
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded"
              >
                Cancella
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-red-600/30 shrink-0 active:scale-95"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isLoading ? 'Ricerca...' : 'Cerca'}</span>
          </button>
        </form>

        {/* Popular Suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
          <span className="text-slate-400 shrink-0 flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Trend:
          </span>
          {POPULAR_SEARCH_SUGGESTIONS.map((term) => (
            <button
              key={term}
              onClick={() => handleSuggestionClick(term)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 shrink-0 transition-colors font-medium"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-5">
        {hasSearched ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Risultati per: <span className="text-white normal-case font-bold">"{activeQueryTitle}"</span>
                </span>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                  {searchResults.length} video trovati
                </span>
              </div>

              <button
                onClick={() => {
                  setHasSearched(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Torna al catalogo
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-16 space-y-3">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-red-500" />
                <p className="text-sm text-slate-300">Ricerca su YouTube in corso...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((video) => {
                  const isPlaying = currentVideo.youtubeId === video.youtubeId;
                  return (
                    <div
                      key={video.id}
                      onClick={() => onSelectVideo(video)}
                      className={`group rounded-2xl border p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                        isPlaying
                          ? 'bg-slate-800/90 border-red-500 shadow-lg shadow-red-950/30 ring-1 ring-red-500/30'
                          : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 mb-3">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white">
                            {video.duration}
                          </div>

                          {isPlaying && (
                            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-md">
                              <Play className="w-3 h-3 fill-current" />
                              <span>In riproduzione</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Channel */}
                        <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors" title={video.title}>
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">
                          {video.channel}
                        </p>
                      </div>

                      {/* Play Action */}
                      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">YouTube Video</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-400 group-hover:text-red-300">
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Guarda</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 space-y-2">
                <Music2 className="w-8 h-8 mx-auto text-slate-500" />
                <p className="text-sm text-slate-300">Nessun video trovato per "{activeQueryTitle}".</p>
                <p className="text-xs text-slate-500">Prova a cercare con parole chiave diverse.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-xs text-slate-500 mr-1 shrink-0">Genere:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogVideos.map((video) => {
                const isPlaying = currentVideo.youtubeId === video.youtubeId;
                return (
                  <div
                    key={video.id}
                    onClick={() => onSelectVideo(video)}
                    className={`group rounded-2xl border p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                      isPlaying
                        ? 'bg-slate-800/90 border-red-500 shadow-lg shadow-red-950/30 ring-1 ring-red-500/30'
                        : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 mb-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white">
                          {video.duration}
                        </div>

                        {isPlaying && (
                          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-md">
                            <Play className="w-3 h-3 fill-current" />
                            <span>In riproduzione</span>
                          </div>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{video.channel}</span>
                        {video.category && <span className="text-slate-500 text-[10px]">{video.category}</span>}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Seleziona</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-400 group-hover:text-red-300">
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
