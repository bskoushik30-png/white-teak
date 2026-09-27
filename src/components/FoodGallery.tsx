"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FOOD_GALLERY_IMAGES, CATEGORY_LINKS, MENU_URL } from "@/lib/constants";
import { SectionMediaItem } from "@/types/database";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TAGLINES: Record<string, string> = {
  Coffee: "Single origin pours",
  Breakfast: "Slow mornings",
  Desserts: "Sweet finishes",
  Savoury: "Hearty plates",
  Beverages: "Crafted sips",
};

export default function FoodGallery({
  media,
  categories,
}: {
  media?: SectionMediaItem[];
  categories?: SectionMediaItem[];
}) {
  const root = useRef<HTMLElement>(null);

  const images = media && media.length > 0
    ? media.map((m) => m.image_url)
    : FOOD_GALLERY_IMAGES;

  const categoryList = categories && categories.length > 0
    ? categories.map((c) => ({ name: c.title || "", image: c.image_url }))
    : CATEGORY_LINKS;

  // Double images for seamless marquee loop (matching 0% to -50% translateX)
  const stream = [...images, ...images];

  useGSAP(
    () => {
      gsap.from(".food-head > *", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".food-head", start: "top 85%" },
      });
      gsap.from(".cat-item", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cat-grid", start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative py-24 lg:py-28 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Header */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="food-head flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <h2
              className="display-hero !text-[clamp(2rem,5vw,4rem)]"
              style={{ color: "#FBF0EE" }}
            >
              The Table
            </h2>
          </div>
          <div className="md:max-w-md md:text-right">
            <p className="font-sans text-[15px] leading-relaxed" style={{ color: "rgba(251,235,232,0.75)" }}>
              All-day food, fresh bakes, familiar favourites and seasonal plates created to complement the way people actually spend time at White Teak.
            </p>
            <a
              href={MENU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 font-sans text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 hover:opacity-80"
              style={{ color: "#f0b8a8" }}
            >
              View Full Menu
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Marquee image rail */}
      <div className="overflow-hidden relative z-10">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {stream.map((src, i) => (
            <div
              key={i}
              className="shrink-0 mx-3 w-80 md:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden relative group"
              style={{ background: "#6b1210" }}
            >
              <Image
                src={src}
                alt={`Dish ${(i % FOOD_GALLERY_IMAGES.length) + 1}`}
                fill
                sizes="(max-width: 768px) 320px, 420px"
                loading={i < 4 ? "eager" : "lazy"}
                className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Category circles */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 mt-20 pb-8">
        <div className="cat-grid flex flex-wrap justify-center gap-x-14 gap-y-14 md:gap-x-20">
          {categoryList.map((cat, i) => (
            <a
              key={cat.name}
              href={MENU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cat-item group flex flex-col items-center gap-4 relative"
            >
              <div className="relative">
                {/* Decorative ring */}
                <span className="absolute -inset-3 rounded-full border border-dashed border-[#f0b8a8]/0 group-hover:border-[#f0b8a8]/60 group-hover:rotate-180 transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="absolute -inset-1 rounded-full bg-[#f0b8a8]/0 group-hover:bg-[#f0b8a8]/15 blur-xl transition-all duration-700" />
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border border-[rgba(240,184,168,0.3)] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)] relative">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover group-hover:scale-[1.15] transition-transform duration-[900ms] ease-out"
                  />
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-[10px] font-medium tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-500"
                  style={{ background: "#f0b8a8", color: "#7d1713" }}>
                  0{i + 1}
                </span>
              </div>
              <div className="text-center">
                <p className="font-display text-xl md:text-2xl leading-none" style={{ color: "#FBF0EE" }}>
                  {cat.name}
                </p>
                <p className="mt-2.5 font-sans text-[10px] tracking-[0.22em] uppercase" style={{ color: "rgba(240,184,168,0.75)" }}>
                  {TAGLINES[cat.name] ?? "Explore"}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </section>
  );
}
