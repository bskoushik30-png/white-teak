"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SectionMediaItem } from "@/types/database";
import { DEFAULT_SECTION_MEDIA } from "@/lib/supabase/media-defaults";

export async function uploadMediaImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const sectionKey = (formData.get("sectionKey") as string) || "general";

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const supabase = await createClient();

    // Create unique filename
    const ext = file.name.split(".").pop() || "webp";
    const cleanFileName = `${sectionKey}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to 'site-images' bucket
    let { data: uploadData, error: uploadError } = await supabase.storage
      .from("site-images")
      .upload(cleanFileName, buffer, {
        contentType: file.type || "image/webp",
        upsert: true,
      });

    // Auto-create bucket if missing
    if (
      uploadError &&
      (uploadError.message?.toLowerCase().includes("bucket") ||
        uploadError.message?.toLowerCase().includes("not found"))
    ) {
      try {
        await supabase.storage.createBucket("site-images", { public: true });
        const retry = await supabase.storage
          .from("site-images")
          .upload(cleanFileName, buffer, {
            contentType: file.type || "image/webp",
            upsert: true,
          });
        uploadData = retry.data;
        uploadError = retry.error;
      } catch (bErr) {
        console.warn("Auto create bucket error:", bErr);
      }
    }

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    if (!uploadData) {
      return { success: false, error: "Upload failed to return storage path." };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("site-images")
      .getPublicUrl(uploadData.path);

    return { success: true, publicUrl: urlData.publicUrl };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to upload file to storage.";
    console.error("Media upload error:", err);
    return { success: false, error: message };
  }
}

export async function upsertMediaItem(item: SectionMediaItem) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("section_media")
      .upsert(
        {
          section_key: item.section_key,
          item_key: item.item_key,
          title: item.title,
          subtitle: item.subtitle,
          image_url: item.image_url,
          alt_text: item.alt_text || item.title || "",
          display_order: item.display_order ?? 0,
          metadata: item.metadata || {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key,item_key" }
      )
      .select();

    if (error) {
      console.error("Supabase upsert error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin", "page");
    revalidatePath("/arrivals", "layout");
    revalidatePath("/arrivals", "page");
    return { success: true, data: data?.[0] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update item";
    console.error("upsertMediaItem error:", err);
    return { success: false, error: message };
  }
}

export async function deleteAllReels() {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("section_media")
      .delete()
      .eq("section_key", "reels");

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin", "page");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete all reels";
    return { success: false, error: message };
  }
}

export async function deleteMediaItem(sectionKey: string, itemKey: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("section_media")
      .delete()
      .eq("section_key", sectionKey)
      .eq("item_key", itemKey);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin", "page");
    revalidatePath("/arrivals", "layout");
    revalidatePath("/arrivals", "page");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete item";
    return { success: false, error: message };
  }
}

/**
 * Automatically scrapes Instagram Reel cover image, caption, title, and likes directly from the Reel link,
 * and uploads the cover image to Supabase Storage for reliable hosting.
 */
export async function fetchInstagramReelMetadata(reelUrl: string) {
  try {
    if (!reelUrl || !reelUrl.includes("instagram.com")) {
      return { success: false, error: "Please provide a valid Instagram URL (e.g. https://www.instagram.com/reel/...)" };
    }

    const match = reelUrl.match(/instagram\.com\/(?:reel|p|tv)\/([^/?#&]+)/i);
    const shortcode = match ? match[1] : null;

    if (!shortcode) {
      return { success: false, error: "Could not find Instagram Reel shortcode from URL." };
    }

    const cleanUrl = `https://www.instagram.com/reel/${shortcode}/`;
    let coverImageUrl: string | null = null;
    let title: string = "";
    let caption: string = "";
    let likeCount: string = "3.5k";

    // 1. Try OpenGraph bot fetch
    try {
      const res = await fetch(cleanUrl, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          "Accept-Language": "en-US,en;q=0.9",
        },
        cache: "no-store",
      });

      if (res.ok) {
        const html = await res.text();
        const ogImageMatch =
          html.match(/<meta property="og:image" content="([^"]+)"/i) ||
          html.match(/property="og:image" content="([^"]+)"/i);
        const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
        const ogDescMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);

        if (ogImageMatch && ogImageMatch[1]) {
          coverImageUrl = ogImageMatch[1].replace(/&amp;/g, "&");
        }

        if (ogTitleMatch && ogTitleMatch[1]) {
          const rawTitle = ogTitleMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&#x1f5a4;/g, "🖤")
            .replace(/&#x2615;/g, "☕")
            .replace(/&#xfe0f;/g, "")
            .replace(/&amp;/g, "&");
          const textMatch = rawTitle.match(/on Instagram:\s*(?:"|“)([\s\S]*?)(?:"|”|$)/i);
          const fullText = textMatch ? textMatch[1].trim() : rawTitle;
          const firstLine = fullText.split("\n")[0].trim();
          title = firstLine.length > 55 ? firstLine.substring(0, 55) + "..." : firstLine;
          caption = fullText.length > 180 ? fullText.substring(0, 180) + "..." : fullText;
        }

        if (ogDescMatch && ogDescMatch[1]) {
          const desc = ogDescMatch[1];
          const likesMatch = desc.match(/([\d.,]+[kKmM]?)\s+likes/i);
          if (likesMatch) {
            likeCount = likesMatch[1];
          }
        }
      }
    } catch (e) {
      console.warn("OG scrape warning:", e);
    }

    // 2. Try Instagram Embed page if coverImageUrl not found
    if (!coverImageUrl) {
      try {
        const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
        const res = await fetch(embedUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          cache: "no-store",
        });
        if (res.ok) {
          const html = await res.text();
          const imgMatch =
            html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/i) ||
            html.match(/src="([^"]+)"[^>]*class="EmbeddedMediaImage"/i) ||
            html.match(/<img[^>]+src="([^"]+scontent[^"]+)"/i);
          if (imgMatch && imgMatch[1]) {
            coverImageUrl = imgMatch[1].replace(/&amp;/g, "&");
          }
        }
      } catch (e) {
        console.warn("Embed scrape warning:", e);
      }
    }

    // 3. Try /media/?size=l redirect fallback
    if (!coverImageUrl) {
      try {
        const mediaUrl = `https://www.instagram.com/p/${shortcode}/media/?size=l`;
        const res = await fetch(mediaUrl, { redirect: "manual" });
        const location = res.headers.get("location");
        if (location) {
          coverImageUrl = location;
        }
      } catch (e) {
        console.warn("Media redirect warning:", e);
      }
    }

    if (!coverImageUrl) {
      return {
        success: false,
        error: "Could not automatically fetch cover image from this link. You can still upload a cover photo manually.",
      };
    }

    // 4. Download the cover photo and save to Supabase Storage
    let finalImageUrl = coverImageUrl;
    try {
      const imgRes = await fetch(coverImageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (imgRes.ok) {
        const arrayBuf = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        const supabase = await createClient();
        const fileName = `reels/cover_${shortcode}_${Date.now()}.jpg`;

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("site-images")
          .upload(fileName, buffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: urlData } = supabase.storage
            .from("site-images")
            .getPublicUrl(uploadData.path);
          finalImageUrl = urlData.publicUrl;
        }
      }
    } catch (e) {
      console.warn("Storage upload fallback to direct URL:", e);
    }

    return {
      success: true,
      imageUrl: finalImageUrl,
      title: title || `White Teak Reel`,
      caption: caption || "Behind the counter craft moments & single-origin pours. ☕",
      likeCount: likeCount || "3.5k",
      permalink: cleanUrl,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch Instagram Reel details";
    return { success: false, error: msg };
  }
}

export async function resetMediaItemToDefault(sectionKey: string, itemKey: string) {
  try {
    const defaultList = DEFAULT_SECTION_MEDIA[sectionKey] || [];
    const defaultItem = defaultList.find((x) => x.item_key === itemKey);

    if (!defaultItem) {
      return { success: false, error: "No default item found" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("section_media")
      .upsert(
        {
          section_key: defaultItem.section_key,
          item_key: defaultItem.item_key,
          title: defaultItem.title,
          subtitle: defaultItem.subtitle,
          image_url: defaultItem.image_url,
          alt_text: defaultItem.alt_text || defaultItem.title || "",
          display_order: defaultItem.display_order,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key,item_key" }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, item: defaultItem };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reset";
    return { success: false, error: message };
  }
}

export async function getAdminStats() {
  try {
    const supabase = await createClient();
    
    const [subsRes, inqRes, mediaRes] = await Promise.all([
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase.from("contact_inquiries").select("id", { count: "exact", head: true }),
      supabase.from("section_media").select("id", { count: "exact", head: true }),
    ]);

    return {
      subscribersCount: subsRes.count || 0,
      inquiriesCount: inqRes.count || 0,
      customPhotosCount: mediaRes.count || 0,
    };
  } catch {
    return { subscribersCount: 0, inquiriesCount: 0, customPhotosCount: 0 };
  }
}

export async function getSubscribersList() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    return data || [];
  } catch {
    return [];
  }
}

export async function getInquiriesList() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    return data || [];
  } catch {
    return [];
  }
}
