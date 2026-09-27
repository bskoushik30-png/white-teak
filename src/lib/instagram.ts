import { createClient } from "@/lib/supabase/server";
import { SectionMediaItem } from "@/types/database";
import { InstagramReel, DEFAULT_REELS } from "@/types/instagram";

export { DEFAULT_REELS };
export type { InstagramReel };

export async function getInstagramReels(): Promise<InstagramReel[]> {
  try {
    const supabase = await createClient();
    // Query reels sorted with display_order ascending
    const { data, error } = await supabase
      .from("section_media")
      .select("*")
      .eq("section_key", "reels")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((item: SectionMediaItem, index: number) => {
      const meta = (item.metadata as Record<string, unknown>) || {};
      const permalink =
        (meta.permalink as string) ||
        "https://www.instagram.com/whiteteakroasters/";

      // Extract shortcode from link (e.g. /reel/DDenNZEy4l3/ or /p/DDenNZEy4l3/)
      const match = permalink.match(
        /instagram\.com\/(?:reel|p|tv)\/([^/?#&]+)/i
      );
      const shortcode = match ? match[1] : undefined;

      // Use saved cover photo, or direct Instagram cover proxy endpoint if empty/fallback
      let thumbnailUrl = item.image_url;
      if (!thumbnailUrl || thumbnailUrl.trim() === "" || thumbnailUrl.includes("dish-1.webp")) {
        if (shortcode) {
          thumbnailUrl = `/api/instagram-cover?shortcode=${shortcode}`;
        } else {
          thumbnailUrl = "/assets/food-gallery/dish-1.webp";
        }
      }

      return {
        id: item.item_key,
        mediaType: (meta.mediaType as "VIDEO" | "IMAGE") || "VIDEO",
        mediaUrl: (meta.videoUrl as string) || "",
        thumbnailUrl,
        permalink,
        shortcode,
        caption: item.subtitle || item.title || "White Teak Coffee Roasters",
        likeCount: (meta.likeCount as string) || "3.5k",
        isTop: Boolean(meta.isTop),
        timestamp: item.created_at,
        displayOrder: index + 1,
      };
    });
  } catch {
    return [];
  }
}
