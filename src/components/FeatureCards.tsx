"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FEATURE_CARDS } from "@/lib/constants";
import { SectionMediaItem } from "@/types/database";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeatureCards({ media }: { media?: SectionMediaItem[] }) {
  const root = useRef<HTMLElement>(null);

  const cards = media && media.length > 0
    ? media.map((m) => ({
        title: m.title || "",
        subtitle: m.subtitle || "",
        image: m.image_url,
      }))
    : FEATURE_CARDS;

  useGSAP(
    () => {
      gsap.from(".feat-card", {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".feat-grid", start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative z-10 pb-20 pt-24 mt-0" style={{ background: "transparent" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="feat-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="feat-card group rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-500"
              style={{ background: "#6b4535" }}
            >
              {/* Image */}
              <div className="aspect-[16/9] relative overflow-hidden" style={{ background: "#3d2518" }}>
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-lg" style={{ color: "rgba(243,236,223,0.3)" }}>
                      {card.title}
                    </span>
                  </div>
                )}
              </div>
              {/* Text */}
              <div className="p-5">
                <p className="font-sans text-xs mb-1.5" style={{ color: "rgba(243,236,223,0.55)" }}>
                  {card.subtitle}
                </p>
                <h3 className="font-display text-lg leading-tight" style={{ color: "#F3ECDF" }}>
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
