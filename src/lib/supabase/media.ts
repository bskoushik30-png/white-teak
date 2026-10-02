import { createClient } from "@/lib/supabase/server";
import { SectionMediaItem } from "@/types/database";
import { DEFAULT_SECTION_MEDIA } from "@/lib/supabase/media-defaults";

export { DEFAULT_SECTION_MEDIA };

export async function getSectionMedia(sectionKey: string): Promise<SectionMediaItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("section_media")
      .select("*")
      .eq("section_key", sectionKey)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_SECTION_MEDIA[sectionKey] || [];
    }

    return data as SectionMediaItem[];
  } catch {
    return DEFAULT_SECTION_MEDIA[sectionKey] || [];
  }
}

export async function getAllSectionMedia(): Promise<Record<string, SectionMediaItem[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("section_media")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_SECTION_MEDIA;
    }

    const grouped: Record<string, SectionMediaItem[]> = { ...DEFAULT_SECTION_MEDIA };

    // If database contains custom reels or locations, use database records directly
    const dbSections = new Set(data.map((d) => d.section_key));
    if (dbSections.has("reels")) {
      grouped.reels = [];
    }
    if (dbSections.has("locations")) {
      grouped.locations = [];
    }
    
    // Group fetched records by section_key
    data.forEach((item: SectionMediaItem) => {
      if (!grouped[item.section_key]) {
        grouped[item.section_key] = [];
      }
      if (item.section_key === "reels" || item.section_key === "locations") {
        grouped[item.section_key].push(item);
      } else {
        const existingIdx = grouped[item.section_key].findIndex(
          (x) => x.item_key === item.item_key
        );
        if (existingIdx >= 0) {
          grouped[item.section_key][existingIdx] = item;
        } else {
          grouped[item.section_key].push(item);
        }
      }
    });

    return grouped;
  } catch {
    return DEFAULT_SECTION_MEDIA;
  }
}
