import React, { useState, useRef } from 'react';
import {
  Grid2X2,
  Columns2,
  Square,
  Maximize2,
  Volume2,
  VolumeX,
  Search,
  Plus,
  RefreshCw,
  ExternalLink,
  X,
  Check,
  LayoutGrid,
  Radio,
  Sliders,
  Tv,
} from 'lucide-react';
import { VideoItem } from '../types';
import { FEATURED_VIDEOS, getEmbedUrl, liveSearchYouTube, parseInputOrQuery } from '../services/youtubeSearch';

interface MultiViewPlayerProps {
  initialVideos?: VideoItem[];
}

export const MultiViewPlayer: React.FC<MultiViewPlayerProps> = ({
  initialVideos,
}) => {
  // Layout mode: 1, 2, 3, or 4 screens
  const [layoutCount, setLayoutCount] = useState<1 | 2 | 3 | 4>(4);

  // 4 Video Slots
  const [slots, setSlots] = useState<VideoItem[]>([
    initialVideos?.[0] || FEATURED_VIDEOS[0],
    initialVideos?.[1] || FEATURED_VIDEOS[1],
    initialVideos?.[2] || FEATURED_VIDEOS[2],
    initialVideos?.[3] || FEATURED_VIDEOS[3],
  ]);

  // Which slot has active audio (0, 1, 2, 3, or null for all muted)
  const [activeAudioSlot, setActiveAudioSlot] = useState<number | null>(0);

  // Video selector modal state
  const [targetSlotForSearch, setTargetSlotForSearch] = useState<number | null>(null);
  const [searchModalQuery, setSearchModalQuery] = useState('');
  const [modalSearchResults, setModalSearchResults] = useState<VideoItem[]>([]);
  const [isSearchingModal, setIsSearchingModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle fullscreen for the entire multiview grid
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Change video for a specific slot
  const handleSelectVideoForSlot = (video: VideoItem, slotIndex: number) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[slotIndex] = video;
      return updated;
    });
    setTargetSlotForSearch(null);
    setSearchModalQuery('');
    setModalSearchResults([]);
  };

  // Open search dialog for a specific slot
  const openSearchForSlot = (slotIndex: number) => {
    setTargetSlotForSearch(slotIndex);
    setSearchModalQuery('');
    setModalSearchResults([]);
  };

  // Execute search in picker modal
  const handleModalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchModalQuery.trim()) return;

    setIsSearchingModal(true);
    try {
      const results = await liveSearchYouTube(searchModalQuery.trim());
      setModalSearchResults(results);
    } catch {
      const parsed = parseInputOrQuery(searchModalQuery.trim());
      setModalSearchResults([parsed]);
    } finally {
      setIsSearchingModal(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-5 bg-[#090b0e] p-3 sm:p-5 rounded-3xl border border-slate-800/80 shadow-2xl">
      {/* Multiview Studio Control Bar */}
      <div className="bg-slate-900/95 backdrop-blur border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Left: Layout switcher buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide uppercase block">
                Regia Multiview
              </span>
              <span className="text-[11px] text-slate-400">Schermi simultanei</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLayoutCount(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                layoutCount === 1
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="1 Schermo singolo"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Singolo</span>
            </button>

            <button
              onClick={() => setLayoutCount(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                layoutCount === 2
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="2 Schermi affiancati"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>2 Video</span>
            </button>

            <button
              onClick={() => setLayoutCount(3)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                layoutCount === 3
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="3 Schermi"
            >
              <span className="font-mono text-xs font-bold">3</span>
              <span>3 Video</span>
            </button>

            <button
              onClick={() => setLayoutCount(4)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                layoutCount === 4
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="4 Schermi (Griglia 2x2)"
            >
              <Grid2X2 className="w-4 h-4" />
              <span>4 Video (2x2)</span>
            </button>
          </div>
        </div>

        {/* Right: Audio Router & Fullscreen */}
        <div className="flex items-center gap-3">
          {/* Audio selector buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1 text-[11px] font-semibold">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              Audio Focus:
            </span>
            {[0, 1, 2, 3].slice(0, layoutCount).map((idx) => {
              const isSelected = activeAudioSlot === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveAudioSlot(isSelected ? null : idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-1 ring-emerald-400/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={`Ascolta audio dello Schermo ${idx + 1}`}
                >
                  <span>#{idx + 1}</span>
                  {isSelected && (
                    <span className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" />
                      <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleToggleFullscreen}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Schermo Intero Griglia"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schermo Intero</span>
          </button>
        </div>
      </div>

      {/* Multiview Grid Layout */}
      <div
        className={`grid gap-4 transition-all ${
          layoutCount === 1
            ? 'grid-cols-1'
            : layoutCount === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : layoutCount === 3
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {slots.slice(0, layoutCount).map((video, index) => {
          const isAudioActive = activeAudioSlot === index;
          const baseEmbed = getEmbedUrl(video);
          const hasMuteParam = baseEmbed.includes('mute=');
          const embedUrl = hasMuteParam
            ? baseEmbed.replace(/mute=\d/, `mute=${isAudioActive ? 0 : 1}`)
            : `${baseEmbed}&mute=${isAudioActive ? 0 : 1}`;

          return (
            <div
              key={index}
              className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-200 ${
                isAudioActive
                  ? 'border-emerald-500 shadow-emerald-950/30 ring-2 ring-emerald-500/20'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Screen Slot Header */}
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-red-500/30">
                    {index + 1}
                  </span>
                  <p className="font-semibold text-slate-100 truncate text-xs" title={video.title}>
                    {video.title}
                  </p>
                </div>

                {/* Slot Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Audio Mute/Unmute toggle for this slot */}
                  <button
                    onClick={() => setActiveAudioSlot(isAudioActive ? null : index)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                      isAudioActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title={isAudioActive ? 'Audio attivo su questo schermo' : 'Attiva audio per questo schermo'}
                  >
                    {isAudioActive ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-bold">Audio ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Muto</span>
                      </>
                    )}
                  </button>

                  {/* Change video button */}
                  <button
                    onClick={() => openSearchForSlot(index)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-xs font-medium border border-slate-700 active:scale-95"
                    title="Cambia video per questo schermo"
                  >
                    <Search className="w-3 h-3 text-red-400" />
                    <span>Cambia</span>
                  </button>
                </div>
              </div>

              {/* Video Iframe Embed */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={embedUrl}
                  title={`Schermo ${index + 1} - ${video.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="w-full h-full border-0"
                />
              </div>

              {/* Bottom Slot Info Bar */}
              <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate font-medium text-slate-300">{video.channel}</span>
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 flex items-center gap-1 text-[11px] font-medium transition-colors"
                >
                  <span>Apri su YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Change Video for Specific Slot */}
      {targetSlotForSearch !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-red-600 text-white font-mono text-xs flex items-center justify-center">
                    {targetSlotForSearch + 1}
                  </span>
                  <span>Scegli Video per lo Schermo #{targetSlotForSearch + 1}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cerca qualsiasi titolo su YouTube o incolla un link/ID
                </p>
              </div>

              <button
                onClick={() => setTargetSlotForSearch(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-900">
              <form onSubmit={handleModalSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchModalQuery}
                    onChange={(e) => setSearchModalQuery(e.target.value)}
                    placeholder="Cerca su YouTube (es. 'Coldplay', 'Vasco', 'Lo-Fi', 'Podcast')..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingModal}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shrink-0 shadow-md shadow-red-600/30"
                >
                  {isSearchingModal ? 'Ricerca...' : 'Cerca'}
                </button>
              </form>
            </div>

            {/* Modal Results & Featured Picks */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {modalSearchResults.length > 0 ? 'Risultati di Ricerca YouTube:' : 'Brani & Video Consigliati:'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(modalSearchResults.length > 0 ? modalSearchResults : FEATURED_VIDEOS).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectVideoForSlot(item, targetSlotForSearch)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800 hover:border-red-500/50 text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-12 object-cover rounded-xl shrink-0 bg-slate-900 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-red-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.channel}
                      </p>
                    </div>
                    <span className="shrink-0 px-2.5 py-1.5 rounded-xl bg-red-600/20 text-red-400 font-bold text-[11px] group-hover:bg-red-600 group-hover:text-white transition-colors">
                      Imposta
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
