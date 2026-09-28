"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionMediaItem } from "@/types/database";
import { DEFAULT_SECTION_MEDIA } from "@/lib/supabase/media-defaults";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function LocationsSection({
  media,
}: {
  media?: SectionMediaItem[];
}) {
  const root = useRef<HTMLElement>(null);

  const fallbackList = DEFAULT_SECTION_MEDIA.locations || [];
  const rawList = media && media.length > 0 ? media : fallbackList;

  const locationsList = rawList.map((item, i) => {
    const meta = (item.metadata || {}) as Record<string, unknown>;

    // Auto-resolve known default photos if missing
    let imageUrl = item.image_url;
    if (!imageUrl || imageUrl.trim() === "") {
      if (item.item_key === "loc_gokulam" || i === 0) {
        imageUrl = "/locations/wtcr_gokulam.webp";
      } else if (item.item_key === "loc_kavi_mane" || i === 1) {
        imageUrl = "/locations/kavi_mane.webp";
      } else if (item.item_key === "loc_sainikpuri" || i === 2) {
        imageUrl = "/locations/sainikpuri.webp";
      }
    }

    const isComingSoon =
      Boolean(meta.isComingSoon) ||
      (item.title &&
        item.title.toLowerCase().includes("bengaluru") &&
        (!imageUrl || imageUrl.trim() === "")) ||
      (item.subtitle && item.subtitle.toLowerCase().includes("brewing"));

    const mapUrl =
      (meta.mapUrl as string) ||
      (meta.map_url as string) ||
      (i === 0
        ? "https://maps.app.goo.gl/moxAK2FQvw7uPfEv7"
        : i === 1
        ? "https://maps.app.goo.gl/WfUXMxy5b121QkMu5"
        : i === 2
        ? "https://maps.app.goo.gl/yZ2Ra8chnnLyr1QL8"
        : undefined);

    return {
      id: item.item_key || `loc-${i}`,
      name:
        item.title ||
        (i === 0
          ? "Gokulam"
          : i === 1
          ? "Kavi Mane"
          : i === 2
          ? "Sainikpuri"
          : "Bengaluru"),
      hours: item.subtitle || (isComingSoon ? "Brewing Soon" : "7 AM – 11 PM"),
      mapUrl: isComingSoon ? undefined : mapUrl,
      img: !isComingSoon && imageUrl && imageUrl.trim() !== "" ? imageUrl : null,
      isComingSoon,
    };
  });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".loc-head > *",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".loc-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="locations" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <div className="loc-head mb-12 lg:mb-16">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
            Find Us
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight tracking-[-0.02em] text-white">
            We are here
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] md:text-base leading-relaxed text-white/70">
            Every White Teak has its own personality. The common thread is the
            coffee, the craft and the feeling of being somewhere you want to stay
            a little longer.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {locationsList.map((loc) => {
            const isComingSoon = loc.isComingSoon || loc.img === null;

            return (
              <a
                key={loc.id}
                href={isComingSoon ? undefined : loc.mapUrl}
                target={isComingSoon ? undefined : "_blank"}
                rel={isComingSoon ? undefined : "noopener noreferrer"}
                className={`loc-card group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#160e0a] transition-all duration-300 ${
                  isComingSoon
                    ? "cursor-default opacity-85"
                    : "hover:-translate-y-1.5 hover:border-[#c8d96a]/50 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7)]"
                }`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/40">
                  {isComingSoon ? (
                    <div className="absolute inset-0 bg-[#160e0a] flex flex-col items-center justify-center p-4 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c8d96a]/15 border border-[#c8d96a]/30 mb-3 text-xl">
                        ☕
                      </div>
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#c8d96a]">
                        Brewing Soon
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={loc.img!}
                      alt={loc.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 lg:p-5">
                  <p className="font-display text-[1.2rem] font-semibold leading-tight text-white lg:text-[1.4rem]">
                    {loc.name}
                  </p>
                  <p className="mt-1 font-sans text-[12px] tracking-[0.04em] text-white/70 flex items-center justify-between">
                    <span>{loc.hours}</span>
                    {!isComingSoon && loc.mapUrl && (
                      <span className="text-[11px] text-[#c8d96a] font-semibold uppercase tracking-wider group-hover:underline">
                        Directions ↗
                      </span>
                    )}
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/0 transition-all duration-300 group-hover:ring-white/20" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
