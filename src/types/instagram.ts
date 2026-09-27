export interface InstagramReel {
  id: string;
  mediaType: "VIDEO" | "IMAGE";
  mediaUrl: string;
  thumbnailUrl: string;
  permalink: string;
  shortcode?: string;
  caption: string;
  likeCount?: string;
  views?: string;
  isTop?: boolean;
  timestamp?: string;
  displayOrder?: number;
}

export const DEFAULT_REELS: InstagramReel[] = [];

