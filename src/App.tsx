/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Play,
  Search,
  Youtube,
  Compass,
  Tv,
  Grid2X2,
} from 'lucide-react';
import { YouTubePlayer } from './components/YouTubePlayer';
import { MultiViewPlayer } from './components/MultiViewPlayer';
import { YouTubeSearchPanel } from './components/YouTubeSearchPanel';
import { VideoItem } from './types';
import { FEATURED_VIDEOS, liveSearchYouTube, parseInputOrQuery } from './services/youtubeSearch';

export default function App() {
  const [activeTab, setActiveTab] = useState<'player' | 'multiview' | 'search'>('player');
  const [currentVideo, setCurrentVideo] = useState<VideoItem>(FEATURED_VIDEOS[0]);
  const [topSearchQuery, setTopSearchQuery] = useState('');
  const [playlist, setPlaylist] = useState<VideoItem[]>(FEATURED_VIDEOS);

  // Global search from top header
  const handleTopSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = topSearchQuery.trim();
    if (!clean) return;

    try {
      const results = await liveSearchYouTube(clean);
      if (results.length > 0) {
        setPlaylist(results);
        setCurrentVideo(results[0]);
        setActiveTab('player');
      } else {
        const parsed = parseInputOrQuery(clean);
        setCurrentVideo(parsed);
        setActiveTab('player');
      }
    } catch {
      const parsed = parseInputOrQuery(clean);
      setCurrentVideo(parsed);
      setActiveTab('player');
    }
  };

  const handleSelectVideo = (video: VideoItem) => {
    setCurrentVideo(video);
    setActiveTab('player');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header - YouTube Style */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand: KoreTube */}
          <div
            onClick={() => setActiveTab('player')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-lg text-white tracking-tight">Kore</span>
              <span className="font-extrabold text-lg text-red-500 tracking-tight">Tube</span>
            </div>
          </div>

          {/* Central Search Bar (YouTube Style) */}
          <form
            onSubmit={handleTopSearchSubmit}
            className="flex-1 max-w-xl mx-2 hidden sm:flex items-center"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={topSearchQuery}
                onChange={(e) => setTopSearchQuery(e.target.value)}
                placeholder="Cerca su YouTube..."
                className="w-full pl-4 pr-10 py-2 rounded-l-full bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              {topSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTopSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-r-full bg-slate-800 hover:bg-slate-700 border border-l-0 border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Cerca"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation Controls: Player, Multiview, Search */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'player'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">Player</span>
            </button>

            <button
              onClick={() => setActiveTab('multiview')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'multiview'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
              title="Modalità Schermo Diviso fino a 4 Video"
            >
              <Grid2X2 className="w-4 h-4" />
              <span>Multiview (4 Schermi)</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Cerca Video</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="p-3 sm:hidden border-t border-slate-800/60 bg-slate-950">
          <form onSubmit={handleTopSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={topSearchQuery}
                onChange={(e) => setTopSearchQuery(e.target.value)}
                placeholder="Cerca su YouTube..."
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold"
            >
              Cerca
            </button>
          </form>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6">
        {activeTab === 'player' && (
          <YouTubePlayer
            currentVideo={currentVideo}
            onSelectVideo={handleSelectVideo}
            playlist={playlist}
            onOpenMultiView={() => setActiveTab('multiview')}
          />
        )}

        {activeTab === 'multiview' && (
          <MultiViewPlayer
            initialVideos={playlist}
          />
        )}

        {activeTab === 'search' && (
          <YouTubeSearchPanel
            currentVideo={currentVideo}
            onSelectVideo={handleSelectVideo}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">KoreTube</span>
            <span>·</span>
            <span>Player Singolo & Multiview Fino a 4 Video</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Griglia Divisa 2x2</span>
            <span>·</span>
            <span>Audio Selezionabile</span>
            <span>·</span>
            <span>YouTube Ufficiale</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
