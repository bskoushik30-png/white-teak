"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { SectionMediaItem } from "@/types/database";
import { DEFAULT_SECTION_MEDIA } from "@/lib/supabase/media-defaults";
import { uploadMediaImage } from "@/app/actions/media";

interface FooterAdminSectionProps {
  mediaData: Record<string, SectionMediaItem[]>;
  savingKey: string | null;
  uploadingKey: string | null;
  uploadStatusText: string;
  handleFieldChange: (
    sectionKey: string,
    itemKey: string,
    field: keyof SectionMediaItem,
    value: string | number
  ) => void;
  handleMetaChange: (
    sectionKey: string,
    itemKey: string,
    metaKey: string,
    value: string | boolean
  ) => void;
  handleFileUpload: (
    sectionKey: string,
    itemKey: string,
    e: React.ChangeEvent<HTMLInputElement>,
    isVideo?: boolean
  ) => void;
  handleSaveItem: (item: SectionMediaItem) => Promise<void>;
  handleResetItem: (sectionKey: string, itemKey: string) => Promise<void>;
  handleSaveAllFooter: () => Promise<void>;
  setActiveTab: (tab: string) => void;
  setPreviewImage: (url: string | null) => void;
  showToast: (msg: string) => void;
}

export default function FooterAdminSection({
  mediaData,
  savingKey,
  uploadingKey,
  uploadStatusText,
  handleFieldChange,
  handleMetaChange,
  handleFileUpload,
  handleSaveItem,
  handleResetItem,
  handleSaveAllFooter,
  setActiveTab,
  setPreviewImage,
  showToast,
}: FooterAdminSectionProps) {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const swiggyInputRef = useRef<HTMLInputElement | null>(null);
  const zomatoInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingBadge, setUploadingBadge] = useState<string | null>(null);

  // Helper to extract a footer item from state or fallback
  const getItem = (itemKey: string): SectionMediaItem => {
    const list = mediaData.footer || DEFAULT_SECTION_MEDIA.footer || [];
    const found = list.find((x) => x.item_key === itemKey);
    if (found) return found;
    const def = (DEFAULT_SECTION_MEDIA.footer || []).find((x) => x.item_key === itemKey);
    return (
      def || {
        section_key: "footer",
        item_key: itemKey,
        title: "",
        subtitle: "",
        image_url: "",
        display_order: 1,
        metadata: {},
      }
    );
  };

  const brandItem = getItem("footer_brand");
  const locHeadingItem = getItem("footer_locations_heading");
  const contactItem = getItem("footer_contact");
  const orderItem = getItem("footer_order");
  const bottomItem = getItem("footer_bottom");

  const brandMeta = (brandItem.metadata || {}) as Record<string, string>;
  const contactMeta = (contactItem.metadata || {}) as Record<string, string>;
  const orderMeta = (orderItem.metadata || {}) as Record<string, string>;
  const bottomMeta = (bottomItem.metadata || {}) as Record<string, string>;

  const locationsList = mediaData.locations || DEFAULT_SECTION_MEDIA.locations || [];

  const handleCustomBadgeUpload = async (
    badgeType: "swiggy" | "zomato",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBadge(badgeType);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sectionKey", "footer");

      const res = await uploadMediaImage(formData);
      if (res.success && res.publicUrl) {
        if (badgeType === "swiggy") {
          handleMetaChange("footer", "footer_order", "swiggyImage", res.publicUrl);
        } else {
          handleMetaChange("footer", "footer_order", "zomatoImage", res.publicUrl);
        }
        showToast(`Uploaded ${badgeType.toUpperCase()} logo successfully! Click 'Save Order Links' to save.`);
      } else {
        alert(res.error || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploadingBadge(null);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#c8d96a]/20 bg-[#160e0a] p-6">
        <div>
          <span className="inline-block rounded-lg bg-[#c8d96a]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#c8d96a] mb-2 border border-[#c8d96a]/30">
            🦶 Footer & Contact Section
          </span>
          <h3 className="font-display text-xl text-[#f3ecdf]">Website Footer Settings</h3>
          <p className="mt-1 text-xs text-white/60 max-w-2xl leading-relaxed">
            Customize the brand emblem, cafe locations display, contact numbers, delivery partners (Swiggy, Zomato, Dine In), and bottom legal credits shown at the bottom of the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAllFooter}
            disabled={savingKey === "all_footer"}
            className="flex items-center gap-2 rounded-xl bg-[#c8d96a] px-5 py-3 text-xs font-semibold text-[#110b07] shadow-lg shadow-[#c8d96a]/20 hover:bg-[#d8e878] transition disabled:opacity-50"
          >
            <span>💾</span>
            <span>{savingKey === "all_footer" ? "Saving All..." : "Save All Footer Changes"}</span>
          </button>
        </div>
      </div>

      {/* Grid of Footer Sections */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 1. Brand Emblem & Logo */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#160e0a] p-6 shadow-xl">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">☕</span>
                <h4 className="font-display text-base text-[#f3ecdf]">Brand Emblem & Logo</h4>
              </div>
              <span className="rounded-md bg-black/40 px-2.5 py-1 font-mono text-[10px] text-[#c8d96a]">
                Left Column
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-white/5 bg-black/30 p-4">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#110b07] flex items-center justify-center p-3">
                {brandItem.image_url ? (
                  <Image
                    src={brandItem.image_url}
                    alt={brandItem.title || "White Teak Logo"}
                    width={100}
                    height={100}
                    className="h-auto w-full object-contain"
                  />
                ) : (
                  <span className="text-[10px] text-white/30">No Logo</span>
                )}
                {brandItem.image_url && (
                  <button
                    type="button"
                    onClick={() => setPreviewImage(brandItem.image_url)}
                    className="absolute right-1 top-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] text-white/80"
                  >
                    🔍
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <h5 className="font-display text-sm text-[#f3ecdf]">White Teak Emblem</h5>
                <p className="text-[11px] text-white/50">
                  Upload a crisp transparent PNG or WebP circular brush logo.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    className="hidden"
                    onChange={(e) => handleFileUpload("footer", "footer_brand", e)}
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingKey === "footer_brand"}
                    className="flex items-center gap-1.5 rounded-lg border border-[#c8d96a] bg-[#c8d96a]/15 px-3 py-1.5 text-xs font-semibold text-[#c8d96a] hover:bg-[#c8d96a]/25 transition"
                  >
                    <span>🖼️</span>
                    <span>{uploadingKey === "footer_brand" ? "Uploading..." : "Upload New Logo"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/50 mb-1">
                  Logo Image URL
                </label>
                <input
                  type="text"
                  value={brandItem.image_url ?? ""}
                  onChange={(e) => handleFieldChange("footer", "footer_brand", "image_url", e.target.value)}
                  placeholder="/white-teak-logo.png or https://..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/50 mb-1">
                    Brand Name / Title
                  </label>
                  <input
                    type="text"
                    value={brandItem.title ?? ""}
                    onChange={(e) => handleFieldChange("footer", "footer_brand", "title", e.target.value)}
                    placeholder="White Teak Coffee Roasters"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/50 mb-1">
                    Logo Alt Text
                  </label>
                  <input
                    type="text"
                    value={brandMeta.altText ?? ""}
                    onChange={(e) => handleMetaChange("footer", "footer_brand", "altText", e.target.value)}
                    placeholder="White Teak Coffee Roasters"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              onClick={() => handleResetItem("footer", "footer_brand")}
              className="rounded-xl border border-white/10 px-3.5 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white transition"
            >
              Reset Default
            </button>
            <button
              onClick={() => handleSaveItem(brandItem)}
              disabled={savingKey === "footer_brand"}
              className="flex items-center gap-1.5 rounded-xl bg-[#c8d96a] px-4 py-2 text-xs font-semibold text-[#110b07] hover:bg-[#d8e878] transition disabled:opacity-50"
            >
              <span>{savingKey === "footer_brand" ? "Saving..." : "Save Brand Logo"}</span>
            </button>
          </div>
        </div>

        {/* 2. Column 1 — Our Locations */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#160e0a] p-6 shadow-xl">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📍</span>
                <h4 className="font-display text-base text-[#f3ecdf]">Column 1: Our Locations</h4>
              </div>
              <span className="rounded-md bg-black/40 px-2.5 py-1 font-mono text-[10px] text-[#c8d96a]">
                Footer Column 1
              </span>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-white/50 mb-1">
                Column Heading
              </label>
              <input
                type="text"
                value={locHeadingItem.title ?? "Our Locations"}
                onChange={(e) =>
                  handleFieldChange("footer", "footer_locations_heading", "title", e.target.value)
                }
                placeholder="Our Locations"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-[#c8d96a]/20 bg-[#110b07] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#c8d96a] flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Active Synced Branches ({locationsList.length})</span>
                </span>
                <span className="text-[10px] text-white/40">From Locations tab</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {locationsList.map((loc, i) => (
                  <div
                    key={loc.item_key || i}
                    className="flex flex-col justify-between rounded-lg border border-white/5 bg-black/30 p-2.5"
                  >
                    <span className="font-display text-[#f3ecdf] truncate">
                      {loc.title || `Location ${i + 1}`}
                    </span>
                    <span className="text-[11px] text-white/50">{loc.subtitle || "Hours"}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("locations")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#c8d96a]/30 bg-[#c8d96a]/10 px-4 py-2.5 text-xs font-semibold text-[#c8d96a] hover:bg-[#c8d96a]/20 transition"
                >
                  <span>📍</span>
                  <span>Manage Cafe Branches & Hours in Locations Tab &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              onClick={() => handleResetItem("footer", "footer_locations_heading")}
              className="rounded-xl border border-white/10 px-3.5 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white transition"
            >
              Reset Default
            </button>
            <button
              onClick={() => handleSaveItem(locHeadingItem)}
              disabled={savingKey === "footer_locations_heading"}
              className="flex items-center gap-1.5 rounded-xl bg-[#c8d96a] px-4 py-2 text-xs font-semibold text-[#110b07] hover:bg-[#d8e878] transition disabled:opacity-50"
            >
              <span>{savingKey === "footer_locations_heading" ? "Saving..." : "Save Locations Heading"}</span>
            </button>
          </div>
        </div>

        {/* 3. Column 2 — Contact Us & Social Links */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#160e0a] p-6 shadow-xl">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📞</span>
                <h4 className="font-display text-base text-[#f3ecdf]">Column 2: Contact Us & Socials</h4>
              </div>
              <span className="rounded-md bg-black/40 px-2.5 py-1 font-mono text-[10px] text-[#c8d96a]">
                Footer Column 2
              </span>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-white/50 mb-1">
                Column Heading
              </label>
              <input
                type="text"
                value={contactItem.title ?? "Contact Us"}
                onChange={(e) => handleFieldChange("footer", "footer_contact", "title", e.target.value)}
                placeholder="Contact Us"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
              />
            </div>

            {/* WhatsApp settings */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-3.5 space-y-3">
              <span className="text-xs font-semibold text-[#c8d96a] flex items-center gap-1.5">
                <span>💬</span>
                <span>WhatsApp Settings</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={contactMeta.whatsappLabel ?? "WhatsApp"}
                    onChange={(e) =>
                      handleMetaChange("footer", "footer_contact", "whatsappLabel", e.target.value)
                    }
                    placeholder="WhatsApp"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                    Display Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactMeta.whatsappNumber ?? "+91 9731999040"}
                    onChange={(e) =>
                      handleMetaChange("footer", "footer_contact", "whatsappNumber", e.target.value)
                    }
                    placeholder="+91 9731999040"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  Click-to-Chat WhatsApp Link
                </label>
                <input
                  type="text"
                  value={contactMeta.whatsappLink ?? "https://wa.me/919154990266?text="}
                  onChange={(e) =>
                    handleMetaChange("footer", "footer_contact", "whatsappLink", e.target.value)
                  }
                  placeholder="https://wa.me/919154990266?text="
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                />
              </div>
            </div>

            {/* Email settings */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-3.5 space-y-3">
              <span className="text-xs font-semibold text-[#c8d96a] flex items-center gap-1.5">
                <span>✉️</span>
                <span>Email Settings</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={contactMeta.emailLabel ?? "Email"}
                    onChange={(e) =>
                      handleMetaChange("footer", "footer_contact", "emailLabel", e.target.value)
                    }
                    placeholder="Email"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactMeta.email ?? "whiteteak.social@gmail.com"}
                    onChange={(e) =>
                      handleMetaChange("footer", "footer_contact", "email", e.target.value)
                    }
                    placeholder="whiteteak.social@gmail.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Media links */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-3.5 space-y-3">
              <span className="text-xs font-semibold text-[#c8d96a] flex items-center gap-1.5">
                <span>🌐</span>
                <span>Social Media Profiles</span>
              </span>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={contactMeta.instagram ?? "https://www.instagram.com/whiteteakroasters/?hl=en"}
                  onChange={(e) =>
                    handleMetaChange("footer", "footer_contact", "instagram", e.target.value)
                  }
                  placeholder="https://www.instagram.com/whiteteakroasters/?hl=en"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  Facebook Profile URL
                </label>
                <input
                  type="text"
                  value={contactMeta.facebook ?? "https://www.facebook.com/whiteteakroasters/"}
                  onChange={(e) =>
                    handleMetaChange("footer", "footer_contact", "facebook", e.target.value)
                  }
                  placeholder="https://www.facebook.com/whiteteakroasters/"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              onClick={() => handleResetItem("footer", "footer_contact")}
              className="rounded-xl border border-white/10 px-3.5 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white transition"
            >
              Reset Default
            </button>
            <button
              onClick={() => handleSaveItem(contactItem)}
              disabled={savingKey === "footer_contact"}
              className="flex items-center gap-1.5 rounded-xl bg-[#c8d96a] px-4 py-2 text-xs font-semibold text-[#110b07] hover:bg-[#d8e878] transition disabled:opacity-50"
            >
              <span>{savingKey === "footer_contact" ? "Saving..." : "Save Contact Info"}</span>
            </button>
          </div>
        </div>

        {/* 4. Column 3 — Order Now & Delivery Marketplaces */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#160e0a] p-6 shadow-xl">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🛍️</span>
                <h4 className="font-display text-base text-[#f3ecdf]">Column 3: Order Now & Apps</h4>
              </div>
              <span className="rounded-md bg-black/40 px-2.5 py-1 font-mono text-[10px] text-[#c8d96a]">
                Footer Column 3
              </span>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-white/50 mb-1">
                Column Heading
              </label>
              <input
                type="text"
                value={orderItem.title ?? "Order Now"}
                onChange={(e) => handleFieldChange("footer", "footer_order", "title", e.target.value)}
                placeholder="Order Now"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
              />
            </div>

            {/* Dine In Button */}
            <div className="rounded-xl border border-[#c8d96a]/20 bg-[#110b07] p-3.5 space-y-3">
              <span className="text-xs font-semibold text-[#c8d96a] flex items-center gap-1.5">
                <span>🍽️</span>
                <span>Dine In Pill Button</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={orderMeta.dineInText ?? "Dine In"}
                    onChange={(e) =>
                      handleMetaChange("footer", "footer_order", "dineInText", e.target.value)
                    }
                    placeholder="Dine In"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                    Direct Order / DotPe URL
                  </label>
                  <input
                    type="text"
                    value={orderMeta.dineInLink ?? "https://whiteteak.dotpe.in/catalog/499195/568418"}
                    onChange={(e) =>
                      handleMetaChange("footer", "footer_order", "dineInLink", e.target.value)
                    }
                    placeholder="https://whiteteak.dotpe.in/..."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Swiggy link & badge */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f3ecdf] flex items-center gap-2">
                  <Image src={orderMeta.swiggyImage || "/Swiggy.png"} alt="Swiggy" width={24} height={24} className="h-6 w-auto" />
                  <span>Swiggy Delivery Partner</span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={swiggyInputRef}
                  className="hidden"
                  onChange={(e) => handleCustomBadgeUpload("swiggy", e)}
                />
                <button
                  type="button"
                  onClick={() => swiggyInputRef.current?.click()}
                  disabled={uploadingBadge === "swiggy"}
                  className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70 hover:bg-white/20 transition"
                >
                  {uploadingBadge === "swiggy" ? "Uploading..." : "Upload Logo"}
                </button>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  Swiggy Restaurant Page Link
                </label>
                <input
                  type="text"
                  value={orderMeta.swiggyLink ?? ""}
                  onChange={(e) =>
                    handleMetaChange("footer", "footer_order", "swiggyLink", e.target.value)
                  }
                  placeholder="https://www.swiggy.com/restaurants/..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                />
              </div>
            </div>

            {/* Zomato link & badge */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f3ecdf] flex items-center gap-2">
                  <Image src={orderMeta.zomatoImage || "/zomato2.png"} alt="Zomato" width={40} height={16} className="h-4 w-auto" />
                  <span>Zomato Delivery Partner</span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={zomatoInputRef}
                  className="hidden"
                  onChange={(e) => handleCustomBadgeUpload("zomato", e)}
                />
                <button
                  type="button"
                  onClick={() => zomatoInputRef.current?.click()}
                  disabled={uploadingBadge === "zomato"}
                  className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70 hover:bg-white/20 transition"
                >
                  {uploadingBadge === "zomato" ? "Uploading..." : "Upload Logo"}
                </button>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  Zomato Restaurant Page Link
                </label>
                <input
                  type="text"
                  value={orderMeta.zomatoLink ?? ""}
                  onChange={(e) =>
                    handleMetaChange("footer", "footer_order", "zomatoLink", e.target.value)
                  }
                  placeholder="https://www.zomato.com/mysore/..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              onClick={() => handleResetItem("footer", "footer_order")}
              className="rounded-xl border border-white/10 px-3.5 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white transition"
            >
              Reset Default
            </button>
            <button
              onClick={() => handleSaveItem(orderItem)}
              disabled={savingKey === "footer_order"}
              className="flex items-center gap-1.5 rounded-xl bg-[#c8d96a] px-4 py-2 text-xs font-semibold text-[#110b07] hover:bg-[#d8e878] transition disabled:opacity-50"
            >
              <span>{savingKey === "footer_order" ? "Saving..." : "Save Order Links"}</span>
            </button>
          </div>
        </div>

        {/* 5. Bottom Bar, Legal & Agency Credits */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#160e0a] p-6 shadow-xl lg:col-span-2">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚖️</span>
                <h4 className="font-display text-base text-[#f3ecdf]">Bottom Bar, Legal & Agency Credits</h4>
              </div>
              <span className="rounded-md bg-black/40 px-2.5 py-1 font-mono text-[10px] text-[#c8d96a]">
                Footer Sub-bar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Copyright */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                <span className="text-xs font-semibold text-[#c8d96a] flex items-center gap-1.5">
                  <span>©️</span>
                  <span>Copyright Notice</span>
                </span>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                    Copyright Line
                  </label>
                  <input
                    type="text"
                    value={bottomItem.title ?? "© 2026 White Teak Coffee Roasters"}
                    onChange={(e) => handleFieldChange("footer", "footer_bottom", "title", e.target.value)}
                    placeholder="© 2026 White Teak Coffee Roasters"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
              </div>

              {/* Agency Credits */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                <span className="text-xs font-semibold text-[#c8d96a] flex items-center gap-1.5">
                  <span>🎨</span>
                  <span>Agency & Designer Credits</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                      Credit Prefix
                    </label>
                    <input
                      type="text"
                      value={bottomItem.subtitle ?? "Designed & Managed by"}
                      onChange={(e) =>
                        handleFieldChange("footer", "footer_bottom", "subtitle", e.target.value)
                      }
                      placeholder="Designed & Managed by"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      value={bottomMeta.creditName ?? "LiilMedia"}
                      onChange={(e) =>
                        handleMetaChange("footer", "footer_bottom", "creditName", e.target.value)
                      }
                      placeholder="LiilMedia"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                    Agency Website Link
                  </label>
                  <input
                    type="text"
                    value={bottomMeta.creditUrl ?? "https://www.liitmedia.in"}
                    onChange={(e) =>
                      handleMetaChange("footer", "footer_bottom", "creditUrl", e.target.value)
                    }
                    placeholder="https://www.liitmedia.in"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                  />
                </div>
              </div>

              {/* Privacy Policy */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                <span className="text-xs font-semibold text-[#c8d96a] flex items-center gap-1.5">
                  <span>🔒</span>
                  <span>Privacy Policy Link</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={bottomMeta.privacyLabel ?? "Privacy Policy"}
                      onChange={(e) =>
                        handleMetaChange("footer", "footer_bottom", "privacyLabel", e.target.value)
                      }
                      placeholder="Privacy Policy"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                      URL Link
                    </label>
                    <input
                      type="text"
                      value={bottomMeta.privacyUrl ?? "#"}
                      onChange={(e) =>
                        handleMetaChange("footer", "footer_bottom", "privacyUrl", e.target.value)
                      }
                      placeholder="#"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Terms of Service */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                <span className="text-xs font-semibold text-[#c8d96a] flex items-center gap-1.5">
                  <span>📜</span>
                  <span>Terms of Service Link</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={bottomMeta.termsLabel ?? "Terms of Service"}
                      onChange={(e) =>
                        handleMetaChange("footer", "footer_bottom", "termsLabel", e.target.value)
                      }
                      placeholder="Terms of Service"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">
                      URL Link
                    </label>
                    <input
                      type="text"
                      value={bottomMeta.termsUrl ?? "#"}
                      onChange={(e) =>
                        handleMetaChange("footer", "footer_bottom", "termsUrl", e.target.value)
                      }
                      placeholder="#"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-[#f3ecdf] focus:border-[#c8d96a] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              onClick={() => handleResetItem("footer", "footer_bottom")}
              className="rounded-xl border border-white/10 px-3.5 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white transition"
            >
              Reset Default
            </button>
            <button
              onClick={() => handleSaveItem(bottomItem)}
              disabled={savingKey === "footer_bottom"}
              className="flex items-center gap-1.5 rounded-xl bg-[#c8d96a] px-4 py-2 text-xs font-semibold text-[#110b07] hover:bg-[#d8e878] transition disabled:opacity-50"
            >
              <span>{savingKey === "footer_bottom" ? "Saving..." : "Save Bottom Bar"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
