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
    <div className="min-h-screen bg-[#0b0d11] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header - YouTube Obsidian Style */}
      <header className="border-b border-slate-800/80 bg-[#090b0e]/90 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand: KoreTube */}
          <div
            onClick={() => setActiveTab('player')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <div className="flex items-center">
              <span className="font-black text-xl text-white tracking-tight">Kore</span>
              <span className="font-black text-xl text-red-500 tracking-tight">Tube</span>
            </div>
          </div>

          {/* Central Search Bar (YouTube Style) */}
          <form
            onSubmit={handleTopSearchSubmit}
            className="flex-1 max-w-xl mx-2 hidden sm:flex items-center group"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={topSearchQuery}
                onChange={(e) => setTopSearchQuery(e.target.value)}
                placeholder="Cerca su YouTube..."
                className="w-full pl-5 pr-10 py-2.5 rounded-l-full bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all shadow-inner"
              />
              {topSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTopSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-r-full bg-slate-800 hover:bg-slate-700 border border-l-0 border-slate-700/80 text-slate-300 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Cerca"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Segmented Navigation Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'player'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">Player</span>
            </button>

            <button
              onClick={() => setActiveTab('multiview')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'multiview'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="Modalità Schermo Diviso fino a 4 Video"
            >
              <Grid2X2 className="w-4 h-4" />
              <span>4 Schermi</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Cerca Video</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="p-3 sm:hidden border-t border-slate-800/60 bg-[#090b0e]">
          <form onSubmit={handleTopSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={topSearchQuery}
                onChange={(e) => setTopSearchQuery(e.target.value)}
                placeholder="Cerca su YouTube..."
                className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md shadow-red-600/30 active:scale-95"
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
      <footer className="border-t border-slate-800/80 bg-[#090b0e] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">KoreTube</span>
            <span>·</span>
            <span className="text-slate-400">Player & Regia Multiview 4 Schermi</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Layout Dinamico</span>
            <span>·</span>
            <span>Audio Router con Equalizzatore</span>
            <span>·</span>
            <span>YouTube Official</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
