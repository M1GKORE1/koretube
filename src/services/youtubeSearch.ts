import { VideoItem } from '../types';

export const FEATURED_VIDEOS: VideoItem[] = [
  // Musica Italiana
  {
    id: 'it-1',
    title: 'Annalisa - Sinceramente',
    channel: 'Warner Music Italy',
    duration: '3:35',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'q-5x0gK21vY',
    category: 'Musica Italiana',
  },
  {
    id: 'it-2',
    title: 'Geolier - I P\' ME, TU P\' TE',
    channel: 'Geolier Official',
    duration: '3:20',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'v8y5yH9G5c4',
    category: 'Musica Italiana',
  },
  {
    id: 'it-3',
    title: 'Mahmood - TUTA GOLD',
    channel: 'Mahmood',
    duration: '3:10',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'W3uA8-E0T5U',
    category: 'Musica Italiana',
  },
  {
    id: 'it-4',
    title: 'Vasco Rossi - Albachiara (Live)',
    channel: 'Vasco Rossi',
    duration: '5:40',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'dO1q6b7G5sY',
    category: 'Musica Italiana',
  },
  {
    id: 'it-5',
    title: 'Måneskin - ZITTI E BUONI',
    channel: 'Måneskin Official',
    duration: '3:14',
    thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'QNzCSBU3BHg',
    category: 'Musica Italiana',
  },

  // Lo-Fi & Relax
  {
    id: 'lofi-1',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    channel: 'Lofi Girl',
    duration: 'Live 24/7',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'jfKfPfyJRdk',
    category: 'Lo-Fi & Studio',
  },
  {
    id: 'lofi-2',
    title: 'Chillstep & Synthwave Radio - Endless Chill',
    channel: 'Astral Chill',
    duration: 'Live',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=480&auto=format&fit=crop&q=80',
    youtubeId: '4xDzrJKXOOY',
    category: 'Lo-Fi & Studio',
  },
  {
    id: 'lofi-3',
    title: 'Peaceful Acoustic Guitar - Instrumental Music',
    channel: 'Acoustic Morning',
    duration: '3:45:10',
    thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'kJQP7kiw5Fk',
    category: 'Lo-Fi & Studio',
  },

  // Pop Internazionale
  {
    id: 'pop-1',
    title: 'Coldplay - Viva La Vida',
    channel: 'Coldplay',
    duration: '4:02',
    thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'dvgZkm1xWPE',
    category: 'Pop & Rock Internazionale',
  },
  {
    id: 'pop-2',
    title: 'The Weeknd - Blinding Lights',
    channel: 'The Weeknd',
    duration: '3:20',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=480&auto=format&fit=crop&q=80',
    youtubeId: '4NRXx6U8ABQ',
    category: 'Pop & Rock Internazionale',
  },
  {
    id: 'pop-3',
    title: 'Queen - Bohemian Rhapsody (Official Video)',
    channel: 'Queen Official',
    duration: '5:55',
    thumbnail: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'fJ9rUzIMcZQ',
    category: 'Pop & Rock Internazionale',
  },

  // Podcast & Talk
  {
    id: 'pod-1',
    title: 'Passa dal BSMT - Intervista Speciale',
    channel: 'Gianluca Gazzoli BSMT',
    duration: '1:24:10',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=480&auto=format&fit=crop&q=80',
    youtubeId: '5qap5aO4i9A',
    category: 'Podcast & Show',
  },
  {
    id: 'pod-2',
    title: 'Muschio Selvaggio Show - Puntata Integrale',
    channel: 'Muschio Selvaggio',
    duration: '58:30',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=480&auto=format&fit=crop&q=80',
    youtubeId: 'L_LUpnjgPso',
    category: 'Podcast & Show',
  },
];

export const POPULAR_SEARCH_SUGGESTIONS = [
  'Vasco Rossi',
  'Annalisa',
  'Lofi Girl',
  'Måneskin',
  'Queen',
  'Coldplay',
  'Geolier',
  'Musica rilassante per studiare',
  'Top Hits 2026',
  'Synthwave 80s',
];

/**
 * Performs a live YouTube video search using the server endpoint /api/search with fallback
 */
export async function liveSearchYouTube(query: string): Promise<VideoItem[]> {
  const clean = query.trim();
  if (!clean) return [];

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn('Backend search API failed, using fallback:', err);
  }

  // Fallback to local catalog
  const q = clean.toLowerCase();
  const matches = FEATURED_VIDEOS.filter(
    (v) => v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q) || (v.category && v.category.toLowerCase().includes(q))
  );

  if (matches.length > 0) {
    return matches;
  }

  return [];
}

/**
 * Creates a VideoItem directly from a custom search query for the YouTube Search embed engine
 */
export function createSearchVideoItem(query: string): VideoItem {
  const clean = query.trim();
  return {
    id: `search-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: `Risultati per: "${clean}"`,
    channel: 'Ricerca YouTube Video',
    duration: 'Ricerca Live',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=480&auto=format&fit=crop&q=80',
    youtubeId: '',
    isSearchQuery: true,
    searchQuery: clean,
    category: 'Risultati di Ricerca',
  };
}

/**
 * Parse input string which could be a YouTube URL, video ID, or search query
 */
export function parseInputOrQuery(input: string): VideoItem {
  const clean = input.trim();
  // Check for direct youtube ID or URL
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    const videoId = match[1];
    return {
      id: `custom-${videoId}-${Date.now()}`,
      title: `Video YouTube (${videoId})`,
      channel: 'YouTube Video',
      duration: 'Esterno',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      youtubeId: videoId,
      category: 'Video Personalizzato',
    };
  }

  // If input is exactly an 11-char ID
  if (/^[\w-]{11}$/.test(clean)) {
    return {
      id: `custom-${clean}-${Date.now()}`,
      title: `Video YouTube (${clean})`,
      channel: 'YouTube Video',
      duration: 'Esterno',
      thumbnail: `https://img.youtube.com/vi/${clean}/hqdefault.jpg`,
      youtubeId: clean,
      category: 'Video Personalizzato',
    };
  }

  // Otherwise, treat as a search query
  return createSearchVideoItem(clean);
}

/**
 * Returns the proper iframe embed URL with origin and nocookie for maximum compatibility
 */
export function getEmbedUrl(video: VideoItem): string {
  const origin = typeof window !== 'undefined' && window.location.origin ? encodeURIComponent(window.location.origin) : '';
  const originParam = origin ? `&origin=${origin}` : '';

  if (video.isSearchQuery && video.searchQuery) {
    return `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(video.searchQuery)}&autoplay=1&enablejsapi=1&rel=0${originParam}`;
  }
  return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?enablejsapi=1&autoplay=1&mute=0&controls=1&rel=0${originParam}`;
}
