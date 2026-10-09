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
    <div ref={containerRef} className="space-y-4 bg-slate-950 p-2 sm:p-4 rounded-2xl">
      {/* Multiview Top Bar: Layout Selector & Audio Routing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Left: Layout switcher buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 text-red-500" />
            <span>Schermi:</span>
          </span>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLayoutCount(1)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                layoutCount === 1
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="1 Schermo singolo"
            >
              <Square className="w-3.5 h-3.5" />
              <span>1</span>
            </button>

            <button
              onClick={() => setLayoutCount(2)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                layoutCount === 2
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="2 Schermi affiancati"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>2</span>
            </button>

            <button
              onClick={() => setLayoutCount(3)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                layoutCount === 3
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="3 Schermi"
            >
              <span className="text-xs font-bold px-0.5">3</span>
              <span>Schermi</span>
            </button>

            <button
              onClick={() => setLayoutCount(4)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                layoutCount === 4
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="4 Schermi (Griglia 2x2)"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>4 (2x2)</span>
            </button>
          </div>
        </div>

        {/* Right: Audio Router & Fullscreen */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 px-2 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              Audio:
            </span>
            {[0, 1, 2, 3].slice(0, layoutCount).map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveAudioSlot(activeAudioSlot === idx ? null : idx)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors ${
                  activeAudioSlot === idx
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={`Ascolta audio dello Schermo ${idx + 1}`}
              >
                #{idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="Schermo Intero Griglia"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schermo Intero</span>
          </button>
        </div>
      </div>

      {/* Multiview Grid Layout Container */}
      <div
        className={`grid gap-3 transition-all ${
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
          // Build embed URL: mute if audio is not focused on this slot
          const baseEmbed = getEmbedUrl(video);
          const hasMuteParam = baseEmbed.includes('mute=');
          const embedUrl = hasMuteParam
            ? baseEmbed.replace(/mute=\d/, `mute=${isAudioActive ? 0 : 1}`)
            : `${baseEmbed}&mute=${isAudioActive ? 0 : 1}`;

          return (
            <div
              key={index}
              className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all ${
                isAudioActive ? 'border-emerald-500/80 ring-1 ring-emerald-500/30' : 'border-slate-800'
              }`}
            >
              {/* Screen Slot Header */}
              <div className="px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 font-bold font-mono text-[11px] shrink-0 border border-red-500/30">
                    #{index + 1}
                  </span>
                  <p className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs" title={video.title}>
                    {video.title}
                  </p>
                </div>

                {/* Slot Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Audio Mute/Unmute toggle for this slot */}
                  <button
                    onClick={() => setActiveAudioSlot(isAudioActive ? null : index)}
                    className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                      isAudioActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title={isAudioActive ? 'Audio attivo (clicca per disattivare)' : 'Attiva audio per questo schermo'}
                  >
                    {isAudioActive ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span className="hidden sm:inline text-[10px]">Audio Attivo</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[10px]">Muto</span>
                      </>
                    )}
                  </button>

                  {/* Change video button */}
                  <button
                    onClick={() => openSearchForSlot(index)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-[11px] border border-slate-700"
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
              <div className="px-3 py-2 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate">{video.channel}</span>
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 text-[10px] shrink-0"
                >
                  <span>Apri</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Change Video for Specific Slot */}
      {targetSlotForSearch !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Scegli Video per lo Schermo #{targetSlotForSearch + 1}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cerca qualsiasi titolo su YouTube o incolla un link/ID video
                </p>
              </div>

              <button
                onClick={() => setTargetSlotForSearch(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-900">
              <form onSubmit={handleModalSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchModalQuery}
                    onChange={(e) => setSearchModalQuery(e.target.value)}
                    placeholder="Cerca su YouTube (es. 'Coldplay', 'Vasco', 'Lo-Fi', 'Gaming')..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingModal}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shrink-0"
                >
                  {isSearchingModal ? 'Ricerca...' : 'Cerca'}
                </button>
              </form>
            </div>

            {/* Modal Results & Featured Picks */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {modalSearchResults.length > 0 ? 'Risultati di Ricerca:' : 'Brani e Video Suggeriti:'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(modalSearchResults.length > 0 ? modalSearchResults : FEATURED_VIDEOS).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectVideoForSlot(item, targetSlotForSearch)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition-all group"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-11 object-cover rounded-lg shrink-0 bg-slate-900"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-red-400">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.channel}
                      </p>
                    </div>
                    <span className="shrink-0 px-2 py-1 rounded bg-red-600/20 text-red-400 text-[10px] font-bold group-hover:bg-red-600 group-hover:text-white transition-colors">
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
