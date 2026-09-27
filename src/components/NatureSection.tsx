"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { NATURE_IMAGES } from "@/lib/constants";
import { SectionMediaItem } from "@/types/database";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DEFAULT_CAPTIONS = [
  "Garden Courtyard",
  "Veranda & Lush Greens",
  "Canopy Dining",
  "Warm Wood & Sunlight",
  "The Al Fresco Corner",
  "Indoor Calm",
];

export default function NatureSection({ media }: { media?: SectionMediaItem[] }) {
  const root = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = media && media.length > 0
    ? media.map((m) => m.image_url)
    : NATURE_IMAGES;

  const captions = media && media.length > 0
    ? media.map((m) => m.title || "Ambience")
    : DEFAULT_CAPTIONS;

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(t);
  }, [images.length]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const btn = rail.children[activeIndex] as HTMLElement | undefined;
    if (!btn) return;

    // Only scroll the internal rail container, NEVER touch window or document scroll!
    rail.scrollTo({
      top: btn.offsetTop - rail.offsetTop,
      left: btn.offsetLeft - rail.offsetLeft,
      behavior: "smooth",
    });
  }, [activeIndex]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".nature-head > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
        clearProps: "all",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });

      gsap.from(".nature-stage", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "expo.out",
        clearProps: "all",
        scrollTrigger: { trigger: ".nature-stage", start: "top 85%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section
      id="nature"
      ref={root}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "transparent" }}
    >
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="nature-head text-center mb-16 max-w-2xl mx-auto">
          <p className="eyebrow-brass mb-4" style={{ color: "rgba(243,236,223,0.75)" }}>
            Escape · Breathe · Savour
          </p>
          <h2 className="display-hero !text-[clamp(2.2rem,5.5vw,4.5rem)] text-white" style={{ color: "#F3ECDF" }}>
            Nature&apos;s{" "}
            <span className="font-script font-normal" style={{ color: "#FFFFFF" }}>embrace</span>.
          </h2>
          <p className="font-sans text-[15px] mt-5 leading-relaxed text-white/80" style={{ color: "rgba(243,236,223,0.85)" }}>
            A dining experience enveloped in warmth — open sky above, warm wood
            beneath, and the soft hum of the garden at your elbow.
          </p>
        </div>

        {/* Stage + thumbnails */}
        <div className="nature-stage grid grid-cols-1 md:grid-cols-[1fr_190px] lg:grid-cols-[1fr_220px] gap-4 lg:gap-6 items-stretch">
          <div className="relative aspect-[16/9] md:aspect-auto min-h-[360px] lg:min-h-[480px] rounded-[2rem] overflow-hidden frame-inner">
            {images.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={captions[i] ?? `Nature ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                priority={i === 0}
                className={`object-cover transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  i === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-[1.05]"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="font-display text-2xl md:text-3xl text-white" style={{ color: "#FFFFFF" }}>
                  Where time slows down.
                </p>
              </div>
              <div className="flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === activeIndex
                        ? "w-10 bg-[color:var(--color-brass)]"
                        : "w-4 bg-[color:var(--color-ivory)]/40 hover:bg-[color:var(--color-ivory)]/70"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Thumbnails on the right */}
          <div ref={railRef} className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] lg:max-h-[520px] pr-1.5 scroll-smooth-x scrollbar-none">
            {images.map((src, i) => {
              const thumbSrc = src.includes("/ambience-") ? src.replace("/ambience-", "/thumb-ambience-") : src;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`nature-thumb relative shrink-0 w-36 md:w-full h-24 lg:h-28 rounded-2xl overflow-hidden group transition-all duration-500 cursor-pointer ${
                    i === activeIndex
                      ? "ring-2 ring-[color:var(--color-brass)] opacity-100 shadow-lg scale-[1.02]"
                      : "opacity-60 hover:opacity-95"
                  }`}
                >
                  <Image
                    src={thumbSrc}
                    alt={captions[i] ?? `Ambience ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 160px, 240px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute inset-0 bg-[color:var(--color-espresso)]/20 group-hover:bg-transparent transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
