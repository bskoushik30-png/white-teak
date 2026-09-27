import { createClient } from "@/lib/supabase/server";
import { LOCATIONS, CATEGORY_LINKS, AMBIENCE_IMAGES, FOOD_GALLERY_IMAGES, FARM_IMAGES } from "@/lib/constants";

export async function getLocations() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return LOCATIONS;
    }

    return data.map((item) => ({
      name: item.name,
      hours: item.hours,
      mapUrl: item.map_url,
    }));
  } catch {
    return LOCATIONS;
  }
}

export async function getCategories() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return CATEGORY_LINKS;
    }

    return data.map((item) => ({
      name: item.name,
      image: item.image_url,
    }));
  } catch {
    return CATEGORY_LINKS;
  }
}

export async function getGalleryImages(type: "food" | "ambience" | "farm") {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("type", type)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (type === "food") return FOOD_GALLERY_IMAGES;
      if (type === "ambience") return AMBIENCE_IMAGES;
      if (type === "farm") return FARM_IMAGES;
      return [];
    }

    return data.map((item) => item.image_url);
  } catch {
    if (type === "food") return FOOD_GALLERY_IMAGES;
    if (type === "ambience") return AMBIENCE_IMAGES;
    if (type === "farm") return FARM_IMAGES;
    return [];
  }
}
