"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionMediaItem } from "@/types/database";
import { DEFAULT_SECTION_MEDIA } from "@/lib/supabase/media-defaults";
import {
  upsertMediaItem,
  uploadMediaImage,
  resetMediaItemToDefault,
  deleteAllReels,
  deleteMediaItem,
  fetchInstagramReelMetadata,
  getAdminStats,
  getSubscribersList,
  getInquiriesList,
} from "@/app/actions/media";
import { createClient } from "@/lib/supabase/client";

const SECTIONS = [
  { key: "hero", label: "Hero Banner", icon: "✨", count: 1 },
  { key: "arrivals", label: "New Arrivals (Summer Affair)", icon: "🥭", count: 3 },
  { key: "food_gallery", label: "Food Gallery", icon: "🍽️", count: 10 },
  { key: "nature", label: "Nature & Ambience", icon: "🌿", count: 6 },
  { key: "story", label: "Story & Craft", icon: "📖", count: 5 },
  { key: "farm", label: "Farm & Origin", icon: "🌾", count: 3 },
  { key: "feature_cards", label: "Feature Cards", icon: "🎴", count: 4 },
  { key: "categories", label: "Categories", icon: "🗂️", count: 5 },
  { key: "locations", label: "Locations", icon: "📍", count: null },
  { key: "reels", label: "Instagram Reels", icon: "🎬", count: null },
  { key: "leads", label: "Leads & Subscribers", icon: "📬", count: null },
];

/**
 * Extracts a high-quality frame from a video file in the browser
 */
async function extractThumbnailFromVideo(videoFile: File): Promise<File | null> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;

      const url = URL.createObjectURL(videoFile);
      video.src = url;

      video.onloadeddata = () => {
        // Seek to 1s or middle to avoid black initial frame
        const seekTime = Math.min(1.0, video.duration > 0 ? video.duration / 4 : 0.5);
        video.currentTime = seekTime;
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 720;
        canvas.height = video.videoHeight || 1280;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(null);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const cleanBaseName = videoFile.name.replace(/\.[^/.]+$/, "");
              const thumbFile = new File(
                [blob],
                `thumb_${cleanBaseName}_${Date.now()}.webp`,
                { type: "image/webp" }
              );
              resolve(thumbFile);
            } else {
              resolve(null);
            }
          },
          "image/webp",
          0.88
        );
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Automatically optimizes high-res camera photos in the browser before upload.
 * Reduces 10MB-30MB camera photos to lightweight, crisp WebP (~200KB-500KB) in milliseconds,
 * preventing server payload timeouts and Vercel body limits.
 */
async function compressImageInBrowser(file: File): Promise<File> {
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif" ||
    file.size < 300 * 1024
  ) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      img.onload = () => {
        URL.revokeObjectURL(url);
        const maxDimension = 2000;
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const cleanBaseName = file.name.replace(/\.[^/.]+$/, "");
              const compressedFile = new File(
                [blob],
                `${cleanBaseName}_opt.webp`,
                { type: "image/webp" }
              );
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.88
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
    } catch {
      resolve(file);
    }
  });
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [activeTab, setActiveTab] = useState("hero");
  const [mediaData, setMediaData] = useState<Record<string, SectionMediaItem[]>>(DEFAULT_SECTION_MEDIA);
  const [loadingMedia, setLoadingMedia] = useState(true);

  const [stats, setStats] = useState({ subscribersCount: 0, inquiriesCount: 0, customPhotosCount: 0 });
  const [subscribers, setSubscribers] = useState<Array<{ id: string; email: string; created_at: string }>>([]);
  const [inquiries, setInquiries] = useState<Array<{ id: string; name: string; email: string; phone?: string | null; message: string; created_at: string; status: string }>>([]);

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [fetchingInstaKey, setFetchingInstaKey] = useState<string | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState<string>("Uploading to Supabase...");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const videoInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const savedAuth = localStorage.getItem("wt_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadData() {
      setLoadingMedia(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("section_media")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data) {
          const merged: Record<string, SectionMediaItem[]> = {
            ...DEFAULT_SECTION_MEDIA,
            reels: [],
          };
          const dbSections = new Set(data.map((d) => d.section_key));
          if (dbSections.has("locations")) {
            merged.locations = [];
          }
          data.forEach((item: SectionMediaItem) => {
            if (!merged[item.section_key]) {
              merged[item.section_key] = [];
            }
            if (item.section_key === "reels" || item.section_key === "locations") {
              merged[item.section_key].push(item);
            } else {
              const idx = merged[item.section_key].findIndex(
                (x) => x.item_key === item.item_key
              );
              if (idx >= 0) {
                merged[item.section_key][idx] = item;
              } else {
                merged[item.section_key].push(item);
              }
            }
          });
          setMediaData(merged);
        }

        const [adminStats, subs, inqs] = await Promise.all([
          getAdminStats(),
          getSubscribersList(),
          getInquiriesList(),
        ]);

        setStats(adminStats);
        setSubscribers(subs);
        setInquiries(inqs);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoadingMedia(false);
      }
    }

    loadData();
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "wt@26") {
      setIsAuthenticated(true);
      localStorage.setItem("wt_admin_auth", "true");
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("wt_admin_auth");
  };

  const handleFieldChange = (
    sectionKey: string,
    itemKey: string,
    field: keyof SectionMediaItem,
    value: string | number
  ) => {
    setMediaData((prev) => {
      const list = [...(prev[sectionKey] || [])];
      const idx = list.findIndex((x) => x.item_key === itemKey);
      if (idx >= 0) {
        list[idx] = { ...list[idx], [field]: value };
      }
      return { ...prev, [sectionKey]: list };
    });
  };

  const handleMetaChange = (
    sectionKey: string,
    itemKey: string,
    metaKey: string,
    value: string | boolean
  ) => {
    setMediaData((prev) => {
      const list = [...(prev[sectionKey] || [])];
      const idx = list.findIndex((x) => x.item_key === itemKey);
      if (idx >= 0) {
        const currentMeta = (list[idx].metadata || {}) as Record<string, unknown>;
        list[idx] = {
          ...list[idx],
          metadata: { ...currentMeta, [metaKey]: value },
        };
      }
      return { ...prev, [sectionKey]: list };
    });
  };

  const handleAddNewReel = () => {
    const newIndex = (mediaData.reels?.length || 0) + 1;
    const newReel: SectionMediaItem = {
      section_key: "reels",
      item_key: `reel_${Date.now()}`,
      title: "",
      subtitle: "",
      image_url: "",
      display_order: newIndex,
      metadata: {
        likeCount: "3.5k",
        permalink: "",
        videoUrl: "",
        mediaType: "VIDEO",
      },
    };

    setMediaData((prev) => ({
      ...prev,
      reels: [...(prev.reels || []), newReel],
    }));

    showToast("New Reel created! Paste your link, upload video or cover, and click 'Save Changes'.");
  };

  const handleDeleteReel = async (itemKey: string) => {
    if (!confirm("Delete this reel?")) return;

    setSavingKey(itemKey);
    try {
      const res = await deleteMediaItem("reels", itemKey);
      if (res.success) {
        setMediaData((prev) => ({
          ...prev,
          reels: (prev.reels || []).filter((x) => x.item_key !== itemKey),
        }));
        showToast("Reel deleted successfully!");
      } else {
        alert(res.error || "Failed to delete reel");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting reel");
    } finally {
      setSavingKey(null);
    }
  };

  const handleAddNewLocation = () => {
    const currentList = mediaData.locations || DEFAULT_SECTION_MEDIA.locations || [];
    const newIndex = currentList.length + 1;
    const newLocation: SectionMediaItem = {
      section_key: "locations",
      item_key: `loc_${Date.now()}`,
      title: "",
      subtitle: "7 AM – 11 PM",
      image_url: "",
      display_order: newIndex,
      metadata: {
        mapUrl: "",
        isComingSoon: false,
      },
    };

    setMediaData((prev) => ({
      ...prev,
      locations: [...(prev.locations || DEFAULT_SECTION_MEDIA.locations || []), newLocation],
    }));

    showToast(
      "New Location added! Enter the branch name, hours, Google Maps link, upload photo, and click 'Save Changes'."
    );
  };

  const handleDeleteLocation = async (itemKey: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;

    setSavingKey(itemKey);
    try {
      const res = await deleteMediaItem("locations", itemKey);
      if (res.success) {
        setMediaData((prev) => ({
          ...prev,
          locations: (prev.locations || DEFAULT_SECTION_MEDIA.locations || []).filter(
            (x) => x.item_key !== itemKey
          ),
        }));
        showToast("Location deleted successfully!");
      } else {
        alert(res.error || "Failed to delete location");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting location");
    } finally {
      setSavingKey(null);
    }
  };

  const handleDeleteAllReels = async () => {
    if (
      !confirm(
        "Are you sure you want to delete ALL Instagram Reels? This will delete all reels from the database so you can add your own from scratch."
      )
    ) {
      return;
    }

    setLoadingMedia(true);
    try {
      const res = await deleteAllReels();
      if (res.success) {
        setMediaData((prev) => ({
          ...prev,
          reels: [],
        }));
        showToast("All reels deleted successfully! You can now add your own reels.");
      } else {
        alert(res.error || "Failed to delete all reels");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting all reels");
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleAutoFetchInstagram = async (itemKey: string, urlOverride?: string) => {
    const list = mediaData.reels || [];
    const item = list.find((x) => x.item_key === itemKey);
    const meta = ((item?.metadata || {}) as Record<string, string>);
    const reelUrl = urlOverride || meta.permalink;

    if (!reelUrl || !reelUrl.trim()) {
      alert("Please paste your Instagram Reel link first (e.g. https://www.instagram.com/reel/...)");
      return;
    }

    setFetchingInstaKey(itemKey);
    try {
      const res = await fetchInstagramReelMetadata(reelUrl);
      if (res.success && res.imageUrl) {
        const reelsList = [...(mediaData.reels || [])];
        const cur = reelsList.find((x) => x.item_key === itemKey);
        const curMeta = (cur?.metadata || {}) as Record<string, unknown>;

        const updatedReel: SectionMediaItem = {
          section_key: "reels",
          item_key: itemKey,
          image_url: res.imageUrl,
          title: res.title || cur?.title || "",
          subtitle: res.caption || cur?.subtitle || "",
          display_order: cur?.display_order ?? 0,
          metadata: {
            ...curMeta,
            permalink: res.permalink,
            likeCount: res.likeCount,
          },
        };

        setMediaData((prev) => {
          const list = [...(prev.reels || [])];
          const idx = list.findIndex((x) => x.item_key === itemKey);
          if (idx >= 0) {
            list[idx] = updatedReel;
          } else {
            list.push(updatedReel);
          }
          return { ...prev, reels: list };
        });

        // Auto-save immediately to Supabase database
        await upsertMediaItem(updatedReel);
        showToast("✨ Cover photo, caption & likes fetched and saved live to website!");
      } else {
        alert(res.error || "Could not automatically fetch details from Instagram link.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching Instagram reel details");
    } finally {
      setFetchingInstaKey(null);
    }
  };


  const handleFileUpload = async (
    sectionKey: string,
    itemKey: string,
    e: React.ChangeEvent<HTMLInputElement>,
    isDedicatedVideoUpload: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo =
      file.type.startsWith("video/") ||
      /\.(mp4|mov|webm|m4v|avi)$/i.test(file.name);

    setUploadingKey(itemKey);

    try {
      let uploadFile = file;

      // 1. In-browser client image compression for large photos
      if (!isVideo && file.type.startsWith("image/")) {
        setUploadStatusText("Optimizing image for fast upload...");
        uploadFile = await compressImageInBrowser(file);
      }

      setUploadStatusText(
        isVideo
          ? "Uploading video & auto-capturing cover frame..."
          : "Uploading to Supabase Storage..."
      );

      let publicUrl: string | null = null;
      let uploadErrorMessage: string | null = null;

      // 2. Try Direct Client Upload to Supabase Storage (fastest, bypasses server body limits)
      try {
        const supabase = createClient();
        const ext =
          uploadFile.name.split(".").pop() || (isVideo ? "mp4" : "webp");
        const cleanFileName = `${sectionKey}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.${ext}`;

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("site-images")
          .upload(cleanFileName, uploadFile, {
            contentType:
              uploadFile.type || (isVideo ? "video/mp4" : "image/webp"),
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: urlData } = supabase.storage
            .from("site-images")
            .getPublicUrl(uploadData.path);
          publicUrl = urlData.publicUrl;
        } else if (uploadErr) {
          console.warn("Direct client storage upload notice:", uploadErr);
          uploadErrorMessage = uploadErr.message;
        }
      } catch (clientErr) {
        console.warn("Direct client upload exception:", clientErr);
      }

      // 3. Fallback to Server Action if client-side upload didn't return URL
      if (!publicUrl) {
        setUploadStatusText("Uploading via secure server action...");
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("sectionKey", sectionKey);

        const serverRes = await uploadMediaImage(formData);
        if (serverRes.success && serverRes.publicUrl) {
          publicUrl = serverRes.publicUrl;
        } else {
          throw new Error(
            serverRes.error ||
              uploadErrorMessage ||
              "Failed to upload to storage. Check Supabase connection."
          );
        }
      }

      // 4. Prepare updated item and auto-save directly to Supabase
      const currentList = mediaData[sectionKey] || [];
      const curItem = currentList.find((x) => x.item_key === itemKey);

      let updatedItem: SectionMediaItem = {
        section_key: sectionKey,
        item_key: itemKey,
        title: curItem?.title || "",
        subtitle: curItem?.subtitle || "",
        image_url: publicUrl,
        alt_text: curItem?.alt_text || curItem?.title || "",
        display_order: curItem?.display_order ?? 0,
        metadata: curItem?.metadata || {},
      };

      if (isVideo || isDedicatedVideoUpload) {
        const currentMeta = (curItem?.metadata || {}) as Record<string, unknown>;
        let thumbUrl = curItem?.image_url || publicUrl;

        // Auto-extract Cover Frame from Video
        setUploadStatusText("Auto-extracting cover thumbnail from video...");
        const thumbFile = await extractThumbnailFromVideo(file);

        if (thumbFile) {
          const thumbCompressed = await compressImageInBrowser(thumbFile);
          const thumbFormData = new FormData();
          thumbFormData.append("file", thumbCompressed);
          thumbFormData.append("sectionKey", `${sectionKey}/thumbs`);

          const thumbRes = await uploadMediaImage(thumbFormData);
          if (thumbRes.success && thumbRes.publicUrl) {
            thumbUrl = thumbRes.publicUrl;
          }
        }

        updatedItem = {
          ...updatedItem,
          image_url: thumbUrl,
          metadata: {
            ...currentMeta,
            videoUrl: publicUrl,
            mediaType: "VIDEO",
          },
        };
      }

      // Update in-memory state
      setMediaData((prev) => {
        const list = [...(prev[sectionKey] || [])];
        const idx = list.findIndex((x) => x.item_key === itemKey);
        if (idx >= 0) {
          list[idx] = updatedItem;
        } else {
          list.push(updatedItem);
        }
        return { ...prev, [sectionKey]: list };
      });

      // 5. Auto-save live to Supabase DB immediately
      setUploadStatusText("Saving live to website database...");
      const saveRes = await upsertMediaItem(updatedItem);
      if (saveRes.success) {
        showToast(
          isVideo
            ? "🎬 Video uploaded & saved live to website!"
            : "🖼️ Photo uploaded & saved live to website!"
        );
      } else {
        showToast("⚠️ Photo uploaded. Click 'Save Changes' to retry saving to database.");
      }
    } catch (err: unknown) {
      console.error("Upload error details:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Network error or storage upload failure.";
      alert(`Upload failed: ${msg}`);
    } finally {
      setUploadingKey(null);
      // Reset input value so user can re-select if needed
      e.target.value = "";
    }
  };

  const handleSaveItem = async (item: SectionMediaItem) => {
    setSavingKey(item.item_key);
    try {
      const res = await upsertMediaItem(item);
      if (res.success) {
        showToast(`Saved ${item.title || item.item_key} successfully!`);
      } else {
        alert(res.error || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving item");
    } finally {
      setSavingKey(null);
    }
  };

  const handleResetItem = async (sectionKey: string, itemKey: string) => {
    if (!confirm("Reset this item back to original default?")) return;

    setSavingKey(itemKey);
    try {
      const res = await resetMediaItemToDefault(sectionKey, itemKey);
      if (res.success && res.item) {
        handleFieldChange(sectionKey, itemKey, "image_url", res.item.image_url);
        handleFieldChange(sectionKey, itemKey, "title", res.item.title || "");
        handleFieldChange(sectionKey, itemKey, "subtitle", res.item.subtitle || "");
        showToast("Reset to original default!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingKey(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-[#0c0805]">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#160e0a] p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c8d96a]/10 border border-[#c8d96a]/20">
              <span className="text-2xl">☕</span>
            </div>
            <h1 className="font-display text-2xl text-[#f3ecdf]">White Teak Admin</h1>
            <p className="mt-1 text-xs text-white/50">
              Manage website section photos, reels & content
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-[#f3ecdf] placeholder:text-white/20 focus:border-[#c8d96a] focus:outline-none focus:ring-1 focus:ring-[#c8d96a]"
              />
              {passcodeError && (
                <p className="mt-2 text-xs text-red-400">
                  Incorrect passcode. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#c8d96a] py-3 text-sm font-semibold text-[#110b07] transition hover:bg-[#d8e878]"
            >
              Access Dashboard &rarr;
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-white/40 hover:text-white transition"
            >
              &larr; Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentItems = mediaData[activeTab] || [];

  return (
    <div className="min-h-screen pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#c8d96a]/30 bg-[#160e0a] px-5 py-3.5 shadow-2xl text-sm text-[#f3ecdf] backdrop-blur animate-fade-in">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c8d96a] text-black text-xs font-bold">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#160e0a]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
            >
              ✕
            </button>
            <div className="relative h-[70vh] w-[80vw] max-w-3xl">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0906]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c8d96a]/15 border border-[#c8d96a]/30">
              <span className="text-xl">☕</span>
            </div>
            <div>
              <h1 className="font-display text-lg tracking-tight text-[#f3ecdf]">
                White Teak CMS
              </h1>
              <p className="text-[11px] text-white/50">
                Live Supabase Photo & Reels Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <span>Live Website</span>
              <span>↗</span>
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs text-red-300 transition hover:bg-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-6 pt-8">
        {/* Quick Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#160e0a] p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">Sections Managed</p>
            <p className="mt-2 font-display text-2xl text-[#f3ecdf]">9 Sections</p>
            <p className="text-[11px] text-[#c8d96a] mt-1">Hero, Reels, Food, Ambience...</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#160e0a] p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">Total Site Photos & Reels</p>
            <p className="mt-2 font-display text-2xl text-[#f3ecdf]">44+ Media Assets</p>
            <p className="text-[11px] text-white/50 mt-1">Supabase DB & Storage</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#160e0a] p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">Newsletter Subscribers</p>
            <p className="mt-2 font-display text-2xl text-[#c8d96a]">
              {stats.subscribersCount}
            </p>
            <p className="text-[11px] text-white/50 mt-1">Real-time signups</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#160e0a] p-5">
            <p className="text-xs uppercase tracking-wider text-white/50">Contact Inquiries</p>
            <p className="mt-2 font-display text-2xl text-[#f3ecdf]">
              {stats.inquiriesCount}
            </p>
            <p className="text-[11px] text-white/50 mt-1">Customer inquiries</p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mb-8 flex overflow-x-auto border-b border-white/10 pb-2 scrollbar-none gap-2">
          {SECTIONS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-[#c8d96a] text-[#110b07] font-semibold shadow-lg shadow-[#c8d96a]/15"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      isActive
                        ? "bg-black/20 text-[#110b07]"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {tab.key === "reels"
                      ? mediaData.reels?.length || 0
                      : tab.key === "locations"
                      ? mediaData.locations?.length || 4
                      : tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content: Leads & Subscribers */}
        {activeTab === "leads" ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#160e0a] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg text-[#f3ecdf]">
                  Newsletter Subscribers ({subscribers.length})
                </h3>
                <span className="text-xs text-white/40">Real-time table</span>
              </div>
              {subscribers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-white/40">
                  No subscribers yet.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto divide-y divide-white/5 rounded-xl border border-white/10 bg-black/20">
                  {subscribers.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3.5 text-xs">
                      <span className="font-medium text-[#f3ecdf]">{s.email}</span>
                      <span className="text-white/40">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#160e0a] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg text-[#f3ecdf]">
                  Customer Inquiries ({inquiries.length})
                </h3>
                <span className="text-xs text-white/40">Real-time table</span>
              </div>
              {inquiries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-white/40">
                  No inquiries received yet.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="rounded-xl border border-white/10 bg-black/30 p-4 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-[#c8d96a]">{inq.name}</span>
                        <span className="text-white/40">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-white/70 mb-2">
                        {inq.email} {inq.phone && `• ${inq.phone}`}
                      </div>
                      <p className="rounded-lg bg-black/40 p-2.5 text-white/90">
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Tab Content: Section Photos & Media Cards */
          <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="font-display text-xl text-[#f3ecdf]">
                  {SECTIONS.find((s) => s.key === activeTab)?.label}
                </h2>
                <p className="text-xs text-white/50">
                  {activeTab === "reels"
                    ? "Upload reel videos (.mp4/.mov) or paste reel links. Cover thumbnail is auto-fetched or captured!"
                    : activeTab === "locations"
                    ? "Add and manage cafe branches, operating hours, Google Maps directions, and location photos. Changes update live immediately upon saving."
                    : "Upload photos from your computer or paste image links. Changes take effect on the live website immediately upon saving."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {activeTab === "reels" && currentItems.length > 0 && (
                  <button
                    onClick={handleDeleteAllReels}
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
                  >
                    <span>🗑️</span>
                    <span>Delete All Reels</span>
                  </button>
                )}
                {activeTab === "reels" && (
                  <button
                    onClick={handleAddNewReel}
                    className="flex items-center gap-2 rounded-xl bg-[#c8d96a] px-4 py-2.5 text-xs font-semibold text-[#110b07] shadow-lg shadow-[#c8d96a]/20 hover:bg-[#d8e878] transition"
                  >
                    <span>+</span>
                    <span>Add New Reel</span>
                  </button>
                )}
                {activeTab === "locations" && (
                  <button
                    onClick={handleAddNewLocation}
                    className="flex items-center gap-2 rounded-xl bg-[#c8d96a] px-4 py-2.5 text-xs font-semibold text-[#110b07] shadow-lg shadow-[#c8d96a]/20 hover:bg-[#d8e878] transition"
                  >
                    <span>+</span>
                    <span>Add New Location</span>
                  </button>
                )}
                <span className="text-xs text-white/40">
                  {currentItems.length} items
                </span>
              </div>
            </div>

            {loadingMedia ? (
              <div className="py-20 text-center text-sm text-white/40">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#c8d96a] border-t-transparent" />
                Loading section media...
              </div>
            ) : currentItems.length === 0 ? (
              activeTab === "reels" ? (
                <div className="rounded-2xl border border-dashed border-[#c8d96a]/30 bg-[#160e0a]/60 p-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8d96a]/15 text-2xl border border-[#c8d96a]/30">
                    🎬
                  </div>
                  <h3 className="font-display text-lg text-[#f3ecdf]">No Reels Added Yet</h3>
                  <p className="mx-auto mt-2 max-w-md text-xs text-white/60">
                    All previous dummy links are removed. You can now add your own Instagram reels one by one! Paste your Instagram reel link and click Save.
                  </p>
                  <button
                    onClick={handleAddNewReel}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c8d96a] px-6 py-3 text-xs font-semibold text-[#110b07] shadow-lg shadow-[#c8d96a]/20 hover:bg-[#d8e878] transition"
                  >
                    <span>+</span>
                    <span>Add Your First Reel</span>
                  </button>
                </div>
              ) : activeTab === "locations" ? (
                <div className="rounded-2xl border border-dashed border-[#c8d96a]/30 bg-[#160e0a]/60 p-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8d96a]/15 text-2xl border border-[#c8d96a]/30">
                    📍
                  </div>
                  <h3 className="font-display text-lg text-[#f3ecdf]">No Locations Configured</h3>
                  <p className="mx-auto mt-2 max-w-md text-xs text-white/60">
                    Add cafe branch locations, opening hours, Google Maps directions, and store photos.
                  </p>
                  <button
                    onClick={handleAddNewLocation}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c8d96a] px-6 py-3 text-xs font-semibold text-[#110b07] shadow-lg shadow-[#c8d96a]/20 hover:bg-[#d8e878] transition"
                  >
                    <span>+</span>
                    <span>Add Your First Location</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-sm text-white/50">
                  No items configured for this section yet.
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentItems.map((item, index) => {
                  const isSaving = savingKey === item.item_key;
                  const isUploading = uploadingKey === item.item_key;
                  const isReel = item.section_key === "reels";
                  const isLocation = item.section_key === "locations";
                  const meta = (item.metadata || {}) as Record<string, string>;
                  const hasVideo = Boolean(meta.videoUrl);

                  const match = (meta.permalink || "").match(
                    /instagram\.com\/(?:reel|p|tv)\/([^/?#&]+)/i
                  );
                  const shortcode = match ? match[1] : null;

                  const displayImage =
                    item.image_url &&
                    item.image_url.trim() !== "" &&
                    !item.image_url.includes("dish-1.webp")
                      ? item.image_url
                      : isReel && shortcode
                      ? `/api/instagram-cover?shortcode=${shortcode}`
                      : item.image_url;

                  const hasImage = Boolean(displayImage);

                  return (
                    <div
                      key={item.item_key}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#160e0a] transition hover:border-white/20"
                    >
                      {/* Image Preview & Upload Header */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/50">
                        {hasImage ? (
                          <Image
                            src={displayImage}
                            alt={item.title || item.item_key}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-xs text-white/40">
                            {isLocation && Boolean(meta.isComingSoon) ? (
                              <div className="flex flex-col items-center">
                                <span className="text-2xl mb-1">☕</span>
                                <span className="text-[#c8d96a] font-semibold">Brewing Soon</span>
                              </div>
                            ) : (
                              <span>No image assigned</span>
                            )}
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute left-3 top-3 flex items-center gap-2">
                          <span className="rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-mono font-medium text-[#c8d96a] backdrop-blur">
                            #{item.display_order || index + 1} • {item.item_key}
                          </span>
                          {hasVideo && (
                            <span className="rounded-lg bg-[#c8d96a]/20 border border-[#c8d96a]/40 px-2 py-0.5 text-[10px] font-medium text-[#c8d96a] backdrop-blur">
                              🎬 Video Attached
                            </span>
                          )}
                          {isLocation && Boolean(meta.isComingSoon) && (
                            <span className="rounded-lg bg-[#c8d96a]/20 border border-[#c8d96a]/40 px-2 py-0.5 text-[10px] font-medium text-[#c8d96a] backdrop-blur">
                              ☕ Coming Soon
                            </span>
                          )}
                        </div>

                        {/* Quick View Button */}
                        {hasImage && (
                          <button
                            type="button"
                            onClick={() => setPreviewImage(displayImage)}
                            className="absolute right-3 top-3 rounded-lg bg-black/75 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur transition hover:bg-black hover:text-white"
                          >
                            🔍 Zoom
                          </button>
                        )}

                        {/* Fetching Instagram Metadata Overlay */}
                        {fetchingInstaKey === item.item_key && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4 text-center z-20">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c8d96a] border-t-transparent" />
                            <span className="mt-2 text-xs text-[#c8d96a] font-medium">
                              ✨ Fetching cover & details from Instagram...
                            </span>
                          </div>
                        )}

                        {/* Uploading Overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4 text-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c8d96a] border-t-transparent" />
                            <span className="mt-2 text-xs text-[#c8d96a] font-medium">
                              {uploadStatusText}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Content & Fields */}
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div className="space-y-3">
                          {/* Title / Heading */}
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-white/50 mb-1">
                              {isReel
                                ? "Reel Headline / Title"
                                : isLocation
                                ? "Branch / Location Name"
                                : "Title / Name"}
                            </label>
                            <input
                              type="text"
                              value={item.title ?? ""}
                              onChange={(e) =>
                                handleFieldChange(
                                  item.section_key,
                                  item.item_key,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder={
                                isLocation
                                  ? "e.g. Indiranagar, Bengaluru"
                                  : isReel
                                  ? "e.g. Pour Over Ritual"
                                  : "Title"
                              }
                              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-[#f3ecdf] placeholder:text-white/20 focus:border-[#c8d96a] focus:outline-none"
                            />
                          </div>

                          {/* Subtitle / Caption */}
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-white/50 mb-1">
                              {isReel
                                ? "Instagram Caption"
                                : isLocation
                                ? "Operating Hours / Status"
                                : "Subtitle / Description"}
                            </label>
                            <input
                              type="text"
                              value={item.subtitle ?? ""}
                              onChange={(e) =>
                                handleFieldChange(
                                  item.section_key,
                                  item.item_key,
                                  "subtitle",
                                  e.target.value
                                )
                              }
                              placeholder={
                                isLocation
                                  ? "e.g. 7 AM – 11 PM or Brewing Soon"
                                  : isReel
                                  ? "e.g. Crafted with our SCA 85+ single origin beans... ☕"
                                  : "Subtitle"
                              }
                              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-[#f3ecdf] placeholder:text-white/20 focus:border-[#c8d96a] focus:outline-none"
                            />
                          </div>

                          {/* Location Specific Fields: Maps Link, Coming Soon Toggle, Order */}
                          {isLocation && (
                            <div className="space-y-3 rounded-xl border border-[#c8d96a]/20 bg-[#120c08] p-3">
                              {/* 1. Google Maps Directions Link */}
                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">
                                  🗺️ Google Maps Directions Link
                                </label>
                                <input
                                  type="text"
                                  value={meta.mapUrl || ""}
                                  onChange={(e) =>
                                    handleMetaChange(
                                      item.section_key,
                                      item.item_key,
                                      "mapUrl",
                                      e.target.value
                                    )
                                  }
                                  placeholder="https://maps.app.goo.gl/..."
                                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[11px] font-mono text-white/90 placeholder:text-white/20 focus:border-[#c8d96a] focus:outline-none"
                                />
                              </div>

                              {/* 2. Brewing Soon Checkbox & Order */}
                              <div className="grid grid-cols-2 gap-2 items-center">
                                <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-white/10 bg-black/40 p-2 text-[11px] text-white/80 hover:border-white/20 transition">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(meta.isComingSoon)}
                                    onChange={(e) =>
                                      handleMetaChange(
                                        item.section_key,
                                        item.item_key,
                                        "isComingSoon",
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 rounded border-white/20 text-[#c8d96a] accent-[#c8d96a] focus:ring-0"
                                  />
                                  <span>☕ Brewing Soon</span>
                                </label>

                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-0.5">
                                    🔢 Order Position
                                  </label>
                                  <input
                                    type="number"
                                    value={item.display_order ?? (index + 1)}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        item.section_key,
                                        item.item_key,
                                        "display_order",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Reel Specific Fields: Video Upload with Auto-Thumbnail, Like Count & Link */}
                          {isReel && (
                            <div className="space-y-3 rounded-xl border border-[#c8d96a]/20 bg-[#120c08] p-3">
                              {/* 1. Video Upload (Auto Cover Frame Generator) */}
                              <div>
                                <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#c8d96a] mb-1.5">
                                  <span>🎬 Reel Video (.mp4/.mov)</span>
                                  <span className="text-[10px] text-white/40 lowercase font-normal">
                                    (auto-creates cover photo)
                                  </span>
                                </label>

                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={meta.videoUrl || ""}
                                    onChange={(e) =>
                                      handleMetaChange(
                                        item.section_key,
                                        item.item_key,
                                        "videoUrl",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Upload video or paste mp4 URL"
                                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[11px] font-mono text-white/80 placeholder:text-white/20 focus:border-[#c8d96a] focus:outline-none"
                                  />

                                  <input
                                    type="file"
                                    accept="video/mp4,video/quicktime,video/webm"
                                    className="hidden"
                                    ref={(el) => {
                                      videoInputRefs.current[item.item_key] = el;
                                    }}
                                    onChange={(e) =>
                                      handleFileUpload(item.section_key, item.item_key, e, true)
                                    }
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      videoInputRefs.current[item.item_key]?.click()
                                    }
                                    disabled={isUploading}
                                    className="flex items-center gap-1.5 rounded-xl border border-[#c8d96a] bg-[#c8d96a] px-3 py-2 text-[11px] font-semibold text-[#110b07] shadow-md hover:bg-[#d8e878] transition"
                                  >
                                    <span>🎬</span>
                                    <span>Upload Video</span>
                                  </button>
                                </div>
                              </div>

                              {/* 2. Like Count & Order */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">
                                    ❤️ Like Count
                                  </label>
                                  <input
                                    type="text"
                                    value={meta.likeCount || "3.5k"}
                                    onChange={(e) =>
                                      handleMetaChange(
                                        item.section_key,
                                        item.item_key,
                                        "likeCount",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g. 4.8k"
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">
                                    🔢 Order Position
                                  </label>
                                  <input
                                    type="number"
                                    value={item.display_order ?? (index + 1)}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        item.section_key,
                                        item.item_key,
                                        "display_order",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* 3. Instagram Link & Auto-Fetch Button */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-[10px] uppercase tracking-wider text-white/60">
                                    🔗 Instagram Reel Link
                                  </label>
                                  <span className="text-[10px] text-[#c8d96a]/80">
                                    ✨ Auto-fetches cover photo
                                  </span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    value={meta.permalink ?? ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleMetaChange(
                                        item.section_key,
                                        item.item_key,
                                        "permalink",
                                        val
                                      );
                                      if (val.includes("instagram.com/reel/") || val.includes("instagram.com/p/")) {
                                        handleAutoFetchInstagram(item.item_key, val);
                                      }
                                    }}
                                    placeholder="https://www.instagram.com/reel/..."
                                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[11px] text-white/90 font-mono focus:border-[#c8d96a] focus:outline-none"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAutoFetchInstagram(
                                        item.item_key,
                                        meta.permalink
                                      )
                                    }
                                    disabled={
                                      fetchingInstaKey === item.item_key ||
                                      !meta.permalink
                                    }
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#c8d96a]/40 bg-[#c8d96a]/15 px-3.5 py-2 text-[11px] font-semibold text-[#c8d96a] transition hover:bg-[#c8d96a] hover:text-[#110b07] disabled:opacity-50"
                                  >
                                    {fetchingInstaKey === item.item_key ? (
                                      <>
                                        <span className="h-3 w-3 animate-spin rounded-full border border-[#c8d96a] border-t-transparent" />
                                        <span>Fetching...</span>
                                      </>
                                    ) : (
                                      <>
                                        <span>✨</span>
                                        <span>Auto-Fetch Cover</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <p className="mt-1 text-[10px] text-white/40">
                                  Paste your reel link (e.g. <span className="font-mono text-white/60">https://www.instagram.com/reel/DDenNZEy4l3/</span>) and click &quot;Auto-Fetch Cover&quot; to grab the photo, caption, and likes automatically!
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Branch / Section Photo Input */}
                          <div>
                            <label className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/50 mb-1">
                              <span>
                                {isReel
                                  ? "🖼️ Cover Photo (Auto-filled or Custom Override)"
                                  : isLocation
                                  ? "Branch Photo (Exterior/Interior)"
                                  : "Image URL / Storage Path"}
                              </span>
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={item.image_url || ""}
                                onChange={(e) =>
                                  handleFieldChange(
                                    item.section_key,
                                    item.item_key,
                                    "image_url",
                                    e.target.value
                                  )
                                }
                                placeholder="/locations/... or https://..."
                                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[11px] font-mono text-white/80 placeholder:text-white/20 focus:border-[#c8d96a] focus:outline-none"
                              />

                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={(el) => {
                                  fileInputRefs.current[item.item_key] = el;
                                }}
                                onChange={(e) =>
                                  handleFileUpload(item.section_key, item.item_key, e, false)
                                }
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  fileInputRefs.current[item.item_key]?.click()
                                }
                                disabled={isUploading}
                                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold text-[#f3ecdf] transition hover:bg-white/20"
                              >
                                <span>📁</span>
                                <span>{isReel ? "Custom Cover" : "Upload"}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                          {isReel ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteReel(item.item_key)}
                              className="text-[11px] text-red-400/70 hover:text-red-300 transition"
                            >
                              🗑️ Delete Reel
                            </button>
                          ) : isLocation ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteLocation(item.item_key)}
                              className="text-[11px] text-red-400/70 hover:text-red-300 transition"
                            >
                              🗑️ Delete Location
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleResetItem(item.section_key, item.item_key)
                              }
                              disabled={isSaving}
                              className="text-[11px] text-white/40 transition hover:text-white"
                            >
                              ↺ Reset
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleSaveItem(item)}
                            disabled={isSaving || isUploading}
                            className="flex items-center gap-2 rounded-xl bg-[#c8d96a] px-4 py-2 text-xs font-semibold text-[#110b07] transition hover:bg-[#d8e878] disabled:opacity-50"
                          >
                            {isSaving ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <span>Save Changes</span>
                                <span>✓</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
