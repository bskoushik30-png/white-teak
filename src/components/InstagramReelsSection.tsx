"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { InstagramReel, DEFAULT_REELS } from "@/types/instagram";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ReelCardProps {
  item: InstagramReel;
  index: number;
  priority?: boolean;
  tabIndex?: number;
  className?: string;
  isSingle?: boolean;
}

function ReelCard({
  item,
  index,
  priority = false,
  tabIndex,
  className = "",
  isSingle = false,
}: ReelCardProps) {
  const match = (item.permalink || "").match(
    /instagram\.com\/(?:reel|p|tv)\/([^/?#&]+)/i
  );
  const shortcode = item.shortcode || (match ? match[1] : null);

  const coverUrl =
    item.thumbnailUrl &&
    item.thumbnailUrl.trim() !== "" &&
    !item.thumbnailUrl.includes("dish-1.webp")
      ? item.thumbnailUrl
      : shortcode
      ? `/api/instagram-cover?shortcode=${shortcode}`
      : "/assets/food-gallery/dish-1.webp";

  return (
    <a
      href={item.permalink || "https://www.instagram.com/whiteteakroasters/"}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabIndex}
      className={`group/card relative shrink-0 aspect-[9/16] overflow-hidden rounded-[2rem] md:rounded-[2.4rem] border border-white/15 bg-[#140e0a] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-2.5 hover:border-[#c8d96a]/80 hover:shadow-[0_25px_55px_-10px_rgba(200,217,106,0.25)] block ${
        className ||
        (isSingle
          ? "w-full max-w-[340px] sm:max-w-[380px]"
          : "h-80 w-48 sm:h-96 sm:w-56 md:h-[450px] md:w-64 lg:h-[490px] lg:w-72")
      }`}
    >
      {/* Cover Photo */}
      <Image
        src={coverUrl}
        alt={item.caption || `Instagram Reel ${index + 1}`}
        fill
        priority={priority}
        sizes={
          isSingle
            ? "(max-width: 640px) 100vw, 420px"
            : "(max-width: 640px) 260px, 340px"
        }
        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20 p-4 sm:p-5 md:p-6 flex flex-col justify-between text-left">
        {/* Top Bar: Instagram Account & Likes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-white backdrop-blur-md border border-white/15">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span className="font-sans text-[11px] font-semibold">
              @whiteteakroasters
            </span>
          </div>

          <span className="rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-semibold text-[#c8d96a] backdrop-blur-md border border-white/15">
            ❤️ {item.likeCount || "3.5k"}
          </span>
        </div>

        {/* Bottom: Caption & Subtle Link Hint */}
        <div>
          <p className="font-sans text-xs sm:text-sm font-medium text-white/95 line-clamp-3 leading-snug">
            {item.caption || "White Teak Coffee Roasters"}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#c8d96a] transition-all duration-300 group-hover/card:gap-2.5">
            <span>Watch Reel</span>
            <span>↗</span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function InstagramReelsSection({
  initialReels = DEFAULT_REELS,
}: {
  initialReels?: InstagramReel[];
}) {
  const root = useRef<HTMLElement>(null);
  const rawReels =
    initialReels && initialReels.length > 0 ? initialReels : [];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".insta-head > *", {
        y: 25,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: root }
  );

  // Common Header
  const renderHeader = () => (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 text-center mb-10 lg:mb-12">
      <div className="insta-head">
        <p
          className="mb-2.5 font-sans text-[11px] md:text-xs font-semibold uppercase tracking-[0.35em]"
          style={{ color: "#c8d96a" }}
        >
          @WHITETEAKROASTERS
        </p>

        <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] uppercase tracking-[0.02em] leading-tight">
          <span style={{ color: "#F3ECDF" }}>EVERY PIXEL </span>
          <span style={{ color: "#c8d96a" }}>TELLS A STORY.</span>
        </h2>

        <p
          className="mt-2.5 font-sans text-sm md:text-base tracking-wide"
          style={{ color: "rgba(243,236,223,0.7)" }}
        >
          Tap in. Follow us on Instagram.
        </p>
      </div>
    </div>
  );

  // Common Footer CTA
  const renderFooter = () => (
    <div className="mt-10 lg:mt-12 text-center">
      <a
        href="https://www.instagram.com/whiteteakroasters/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-sans text-sm md:text-[15px] font-semibold tracking-wide transition-all duration-300 hover:gap-3"
        style={{ color: "#F3ECDF" }}
      >
        <span>Follow our journey</span>
        <span className="text-base" style={{ color: "#c8d96a" }}>
          →
        </span>
      </a>
    </div>
  );

  // 1. EMPTY STATE (0 Reels)
  if (rawReels.length === 0) {
    return (
      <section
        id="instagram"
        ref={root}
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{ background: "transparent" }}
      >
        {renderHeader()}
        {renderFooter()}
      </section>
    );
  }

  // 2. SINGLE REEL (1 Reel): Render a Centered Tall Luxury Showcase Card
  if (rawReels.length === 1) {
    return (
      <section
        id="instagram"
        ref={root}
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{ background: "transparent" }}
      >
        {renderHeader()}

        {/* Centered Single Taller Reel Card */}
        <div className="mx-auto flex justify-center px-6">
          <ReelCard
            item={rawReels[0]}
            index={0}
            priority={true}
            isSingle={true}
          />
        </div>

        {renderFooter()}
      </section>
    );
  }

  // 3. SMALL SET (2 or 3 Reels): Render Centered Grid Row
  if (rawReels.length <= 3) {
    return (
      <section
        id="instagram"
        ref={root}
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{ background: "transparent" }}
      >
        {renderHeader()}

        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6 px-6">
          {rawReels.map((item, index) => (
            <ReelCard
              key={`static-${item.id}-${index}`}
              item={item}
              index={index}
              priority={true}
            />
          ))}
        </div>

        {renderFooter()}
      </section>
    );
  }

  // 4. FULL SET (4+ Reels): Render Fast Continuous Left-to-Right Marquee
  const baseReels =
    rawReels.length < 8 ? [...rawReels, ...rawReels] : rawReels;

  return (
    <section
      id="instagram"
      ref={root}
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {renderHeader()}

      {/* Infinite Left-to-Right Scrolling Reels Rail - FAST (10s) & ZERO GAP */}
      <div className="insta-rail-container relative w-full overflow-hidden group">
        {/* Soft edge fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-16 md:w-28 bg-gradient-to-r from-[#0c0805]/95 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-16 md:w-28 bg-gradient-to-l from-[#0c0805]/95 to-transparent" />

        {/* Fast continuous Left-to-Right Marquee with two cloned tracks */}
        <div
          className="flex w-max py-4 group-hover:[animation-play-state:paused]"
          style={{
            animation: "marquee-ltr 10s linear infinite",
            willChange: "transform",
          }}
        >
          {/* Track 1 */}
          <div className="flex shrink-0 items-center gap-5 pr-5">
            {baseReels.map((item, index) => (
              <ReelCard
                key={`t1-${item.id}-${index}`}
                item={item}
                index={index}
                priority={index < 6}
              />
            ))}
          </div>

          {/* Track 2 - Exact clone for seamless continuous loop */}
          <div
            className="flex shrink-0 items-center gap-5 pr-5"
            aria-hidden="true"
          >
            {baseReels.map((item, index) => (
              <ReelCard
                key={`t2-${item.id}-${index}`}
                item={item}
                index={index}
                priority={false}
                tabIndex={-1}
              />
            ))}
          </div>
        </div>
      </div>

      {renderFooter()}
    </section>
  );
}
