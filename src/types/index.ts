export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
  category?: string;
  isSearchQuery?: boolean;
  searchQuery?: string;
}
