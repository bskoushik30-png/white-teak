"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FARM_IMAGES } from "@/lib/constants";
import { SectionMediaItem } from "@/types/database";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FarmSection({ media }: { media?: SectionMediaItem[] }) {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = media && media.length > 0
    ? media.map((m) => m.image_url)
    : FARM_IMAGES;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [images.length]);

  useGSAP(
    () => {
      gsap.from(".farm-head > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".farm-head", start: "top 85%" },
      });
      gsap.from(".farm-gallery", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".farm-gallery", start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="py-20" style={{ background: "transparent" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="farm-head text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl" style={{ color: "#F3ECDF" }}>
            From Heart to Hands, Farm to Cup
          </h2>
          <p className="font-sans text-sm mt-3 max-w-xl mx-auto" style={{ color: "rgba(243,236,223,0.65)" }}>
            Our Coffee Farms Nestled in Nature&apos;s Embrace
          </p>
        </div>

        {/* Image carousel */}
        <div className="farm-gallery relative">
          <div className="aspect-[4/3] md:aspect-[16/7] rounded-2xl overflow-hidden relative">
            {images.map((src, i) => {
              const imgStyle: React.CSSProperties = [
                // plantation1 — wide landscape, keep subtle zoom
                { objectPosition: "center center", transform: "scale(1.05)" },
                // plantation2 — woman in orange sari, face top-right; zoom out & anchor top-right
                { objectPosition: "70% 30%", transform: "scale(1)" },
                // plantation3 — woman in blue denim, face/body centered; zoom out fully
                { objectPosition: "50% 25%", transform: "scale(1)" },
              ][i] ?? { objectPosition: "center center", transform: "scale(1)" };

              return (
                <Image
                  key={i}
                  src={src}
                  alt={`Coffee farm ${i + 1}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1400px"
                  className={`object-cover transition-opacity duration-700 ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
                  style={imgStyle}
                />
              );
            })}
          </div>

          {/* Carousel dots */}
          <div className="flex justify-center gap-3 mt-6">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === activeIndex
                    ? "scale-110"
                    : "opacity-40 hover:opacity-70"
                  }`}
                style={{ background: i === activeIndex ? "#F3ECDF" : "rgba(243,236,223,0.35)" }}
                aria-label={`View farm image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
