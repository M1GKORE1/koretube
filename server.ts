import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawVideoRenderer {
  videoId?: string;
  title?: { runs?: Array<{ text?: string }> };
  ownerText?: { runs?: Array<{ text?: string }> };
  lengthText?: { simpleText?: string };
  thumbnail?: { thumbnails?: Array<{ url?: string; width?: number; height?: number }> };
}

interface SectionContent {
  videoRenderer?: RawVideoRenderer;
}

interface SearchResultItem {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  category: string;
}

// 1. Official YouTube Data API v3 Proxy (Uses YOUTUBE_API_KEY if configured in backend environment)
function searchYouTubeOfficialApi(query: string, apiKey: string): Promise<SearchResultItem[] | null> {
  return new Promise((resolve) => {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=18&q=${encodeURIComponent(query)}&key=${encodeURIComponent(apiKey)}`;

    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            console.warn(`YouTube Data API returned HTTP ${res.statusCode}:`, data.slice(0, 150));
            resolve(null);
            return;
          }
          const json = JSON.parse(data);
          const items: Array<{
            id?: { videoId?: string };
            snippet?: {
              title?: string;
              channelTitle?: string;
              thumbnails?: {
                high?: { url?: string };
                medium?: { url?: string };
                default?: { url?: string };
              };
            };
          }> = Array.isArray(json.items) ? json.items : [];

          const videos: SearchResultItem[] = [];
          for (const item of items) {
            const vId = item.id?.videoId;
            if (vId) {
              const snippet = item.snippet || {};
              const thumbs = snippet.thumbnails || {};
              const thumbUrl = thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || `https://img.youtube.com/vi/${vId}/hqdefault.jpg`;
              videos.push({
                id: `yt-${vId}`,
                youtubeId: vId,
                title: snippet.title || 'Video YouTube',
                channel: snippet.channelTitle || 'YouTube',
                duration: 'YouTube Video',
                thumbnail: thumbUrl,
                category: 'YouTube Data API v3',
              });
            }
          }
          resolve(videos);
        } catch (err) {
          console.error('Error parsing YouTube Data API response:', err);
          resolve(null);
        }
      });
    }).on('error', (err) => {
      console.error('YouTube Data API request error:', err);
      resolve(null);
    });
  });
}

// 2. Fallback Scraper Proxy (Zero Gemini API consumption)
function searchYouTubeScraper(query: string): Promise<SearchResultItem[]> {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const match = data.match(/ytInitialData\s*=\s*({.+?});<\/script>/);
            if (!match) {
              resolve([]);
              return;
            }

            const json = JSON.parse(match[1]);
            const sectionList =
              json.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

            const videos: SearchResultItem[] = [];

            for (const section of sectionList) {
              const itemContents: SectionContent[] = section?.itemSectionRenderer?.contents || [];
              for (const item of itemContents) {
                if (item.videoRenderer && typeof item.videoRenderer.videoId === 'string') {
                  const vr = item.videoRenderer;
                  const vId: string = vr.videoId as string;
                  const title: string = vr.title?.runs?.[0]?.text || 'Video YouTube';
                  const channel: string = vr.ownerText?.runs?.[0]?.text || 'YouTube';
                  const duration: string = vr.lengthText?.simpleText || 'Video';
                  const thumbs = vr.thumbnail?.thumbnails || [];
                  const lastThumb = thumbs.length > 0 ? thumbs[thumbs.length - 1].url : undefined;
                  const thumbUrl: string = lastThumb || `https://img.youtube.com/vi/${vId}/hqdefault.jpg`;

                  videos.push({
                    id: `yt-${vId}`,
                    youtubeId: vId,
                    title,
                    channel,
                    duration,
                    thumbnail: thumbUrl,
                    category: 'Risultato YouTube',
                  });

                  if (videos.length >= 18) break;
                }
              }
              if (videos.length >= 18) break;
            }

            resolve(videos);
          } catch (err) {
            console.error('Error parsing YouTube HTML:', err);
            resolve([]);
          }
        });
      }
    ).on('error', (err) => {
      console.error('HTTPS request error to YouTube:', err);
      resolve([]);
    });
  });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Route: Live YouTube Search Proxy (Supports YOUTUBE_API_KEY without touching Gemini API)
  app.get('/api/search', async (req, res) => {
    const query = (req.query.q as string) || '';
    if (!query.trim()) {
      return res.json({ results: [] });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    // Check if official YOUTUBE_API_KEY is configured
    if (apiKey && apiKey !== 'MY_YOUTUBE_API_KEY' && apiKey.trim().length > 10) {
      try {
        const apiResults = await searchYouTubeOfficialApi(query, apiKey.trim());
        if (apiResults && apiResults.length > 0) {
          return res.json({ results: apiResults, source: 'official_youtube_api' });
        }
      } catch (err) {
        console.warn('Official YouTube Data API call failed, using fallback scraper:', err);
      }
    }

    // High performance fallback proxy (does not consume Gemini API tokens)
    try {
      const results = await searchYouTubeScraper(query);
      return res.json({ results, source: 'youtube_proxy' });
    } catch (err) {
      console.error('Search endpoint error:', err);
      return res.status(500).json({ error: 'Search failed', results: [] });
    }
  });

  // API Route: Autocomplete suggestions
  app.get('/api/suggestions', (req, res) => {
    const query = (req.query.q as string) || '';
    if (!query.trim()) {
      return res.json({ suggestions: [] });
    }

    const suggestUrl = `https://suggestqueries.google.com/complete/search?client=chrome&ds=yt&q=${encodeURIComponent(query)}`;
    https.get(
      suggestUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      },
      (resp) => {
        let raw = '';
        resp.on('data', (c) => (raw += c));
        resp.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            const suggestions = Array.isArray(parsed[1]) ? parsed[1] : [];
            res.json({ suggestions });
          } catch {
            res.json({ suggestions: [] });
          }
        });
      }
    ).on('error', () => {
      res.json({ suggestions: [] });
    });
  });

  // Mount Vite or serve static dist
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KoreTube server running on http://0.0.0.0:${PORT}`);
    if (process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY !== 'MY_YOUTUBE_API_KEY') {
      console.log('YouTube Data API v3 key is active on backend.');
    } else {
      console.log('YouTube backend proxy active (No Gemini API consumed).');
    }
  });
}

startServer();
