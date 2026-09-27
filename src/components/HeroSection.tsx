"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { SectionMediaItem } from "@/types/database";

gsap.registerPlugin(useGSAP);

export default function HeroSection({ media }: { media?: SectionMediaItem[] }) {
  const root = useRef<HTMLElement>(null);
  const heroItem = media?.[0];
  const bgImage = heroItem?.image_url || "/assets/hero/hero-bg.webp";

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(
        ".hero-title-line",
        { opacity: 0, y: 60, stagger: 0.12, duration: 1.1 },
      )
        .from(
          ".hero-sub",
          { opacity: 0, y: 30, duration: 0.9 },
          "-=0.6"
        );
    },
    { scope: root }
  );

  return (
    <section
      id="hero"
      ref={root}
      className="relative overflow-hidden min-h-screen flex items-center pt-24 pb-16 lg:pt-28 lg:pb-20"
    >
      {/* Hero Background Image - Natural, light, with minimal subtle text scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={heroItem?.title || "White Teak Coffee Roasters"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Slight dark overlay to tone down the image */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Soft, minimal gradient on left strictly for crisp typography, keeping the image bright */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="display-hero drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]" style={{ color: "#F3ECDF" }}>
            <span className="hero-title-line block overflow-hidden">
              <span className="block">Brewing coffee,</span>
            </span>
            <span className="hero-title-line block overflow-hidden">
              <span className="block">
                Brewing{" "}
                <span className="font-script font-normal" style={{ color: "#c8d96a" }}>
                  Experiences
                </span>
              </span>
            </span>
          </h1>

          <p className="hero-sub mt-8 font-sans text-[16px] md:text-lg leading-[1.7] max-w-xl text-[#f5f1ea] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Specialty coffee, thoughtful food and spaces designed for slow moments.
          </p>
        </div>
      </div>
    </section>
  );
}
