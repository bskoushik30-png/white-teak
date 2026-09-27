"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LOCATIONS } from "@/lib/constants";
import { SectionMediaItem } from "@/types/database";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DEFAULT_LOCATION_IMAGES: (string | null)[] = [
  "/locations/wtcr_gokulam.webp",
  "/locations/kavi_mane.webp",
  "/locations/sainikpuri.webp",
  null, // Bengaluru — coming soon
];

export default function LocationsSection({ media }: { media?: SectionMediaItem[] }) {
  const root = useRef<HTMLElement>(null);

  const locationsList = LOCATIONS.map((loc, i) => {
    const custom = media?.[i];
    const image_url = custom ? custom.image_url : DEFAULT_LOCATION_IMAGES[i];
    return {
      name: custom?.title || loc.name,
      hours: custom?.subtitle || loc.hours,
      mapUrl: loc.mapUrl,
      img: image_url && image_url.trim() !== "" ? image_url : null,
    };
  });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".loc-head > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
      gsap.from(".loc-card", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
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
            Every White Teak has its own personality. The common thread is the coffee, the craft and the feeling of being somewhere you want to stay a little longer.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {locationsList.map((loc) => {
            const isComingSoon = loc.img === null;

            return (
              <a
                key={loc.name}
                href={isComingSoon ? undefined : loc.mapUrl}
                target={isComingSoon ? undefined : "_blank"}
                rel={isComingSoon ? undefined : "noopener noreferrer"}
                className={`loc-card group relative block overflow-hidden rounded-2xl ${isComingSoon ? "cursor-default" : ""}`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  {isComingSoon ? (
                    <div className="absolute inset-0 bg-white/5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={loc.img!}
                      alt={loc.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 lg:p-5">
                  <p className="font-display text-[1.2rem] font-semibold leading-tight text-white lg:text-[1.4rem]">
                    {loc.name}
                  </p>
                  <p className="mt-1 font-sans text-[12px] tracking-[0.04em] text-white/70">
                    {loc.hours}
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
