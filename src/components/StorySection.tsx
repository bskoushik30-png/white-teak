"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { SectionMediaItem } from "@/types/database";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type StoryBlock = {
  title: string;
  image: string;
  paragraphs: string[];
};

const DEFAULT_STORY_BLOCKS: StoryBlock[] = [
  {
    title: "The Coffee",
    image: "/scroll track/ChatGPT_Image_Apr_29__2026__03_03_11_PM-removebg-preview.png",
    paragraphs: [
      "Along with being our founding planter, we work directly with coffee estates and smallholder farmers at origin, sourcing and processing coffees that we carefully curate into a selection of SCA 85+ point-scoring coffees.",
      "We take pride in introducing White Teak Cascara — a coffee cherry tea made from the dried skins of coffee cherries, brewed much like a specialty tea.",
    ],
  },
  {
    title: "The Teas",
    image: "/scroll track/ChatGPT_Image_Apr_29__2026__03_08_59_PM-removebg-preview.png",
    paragraphs: [
      "We source teas directly from farmers and craft them into unique blends in small batches. Freshness matters to us, so the menu stays focused and deliberate instead of overextended.",
      "We never choose flavour over health. Every blend is built with 100% natural ingredients and made to feel as clean as it tastes.",
    ],
  },
  {
    title: "The Bakes",
    image: "/scroll track/ChatGPT_Image_Apr_29__2026__03_08_45_PM-removebg-preview.png",
    paragraphs: [
      "Our bakes come from a craft kitchen that treats comfort food with the same care we give coffee. Each recipe is developed in-house, from signature staples to seasonal additions.",
      "The result is food that feels familiar, but still specific to White Teak in texture, warmth, and detail.",
    ],
  },
  {
    title: "Home Brewing",
    image: "/scroll track/ChatGPT_Image_Apr_29__2026__03_11_42_PM-removebg-preview.png",
    paragraphs: [
      "We curate brewing equipment for people who want to take the White Teak ritual home, whether they are just starting out or refining a daily practice.",
      "The aim is not to overwhelm, but to make better brewing feel accessible, calm, and repeatable.",
    ],
  },
  {
    title: "Events",
    image: "/scroll track/ChatGPT_Image_Apr_29__2026__03_26_30_PM-removebg-preview.png",
    paragraphs: [
      "We bring together people from all walks of life through specially curated events that celebrate coffee, craft, design, and conversation.",
      "This part of the story turns the café into a shared space for artists, makers, musicians, and social changemakers.",
    ],
  },
];

export default function StorySection({ media }: { media?: SectionMediaItem[] }) {
  const root = useRef<HTMLElement>(null);

  const blocks: StoryBlock[] = DEFAULT_STORY_BLOCKS.map((defaultBlock, i) => {
    const custom = media?.[i];
    if (!custom) return defaultBlock;
    return {
      title: custom.title || defaultBlock.title,
      image: custom.image_url || defaultBlock.image,
      paragraphs: defaultBlock.paragraphs,
    };
  });

  useGSAP(
    () => {
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".story-intro",
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      });

      introTl
        .from(".story-eyebrow", {
          opacity: 0,
          y: 14,
          duration: 0.5,
          ease: "power3.out",
        })
        .from(
          ".story-headline > *",
          {
            opacity: 0,
            y: 28,
            stagger: 0.08,
            duration: 0.7,
            ease: "expo.out",
          },
          "-=0.2"
        )
        .from(
          ".story-divider",
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.35"
        );

      const timelineFill = root.current?.querySelector(".timeline-fill") as HTMLElement;
      const timelineTrack = root.current?.querySelector(".timeline-track") as HTMLElement;

      if (timelineTrack && timelineFill) {
        gsap.to(timelineFill, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineTrack,
            start: "top 70%",
            end: "bottom 50%",
            scrub: 0.5,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {
        const dot = item.querySelector(".timeline-dot") as HTMLElement;
        const ring = item.querySelector(".timeline-ring") as HTMLElement;
        const content = item.querySelector(".timeline-content") as HTMLElement;
        const isLeft = i % 2 === 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
        );

        tl.fromTo(
          ring,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.2"
        );

        tl.fromTo(
          content,
          { opacity: 0, x: isLeft ? -40 : 40, y: 16 },
          { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "expo.out" },
          "-=0.25"
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      id="story"
      ref={root}
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "transparent" }}
    >
      <div className="relative mx-auto max-w-[1140px] px-6 lg:px-12">
        {/* intro */}
        <div className="story-intro max-w-[1040px]">
          <p className="story-eyebrow mb-4 font-sans text-[13px] font-semibold uppercase tracking-[0.24em] md:text-[15px]" style={{ color: "rgba(243,236,223,0.7)" }}>
            Our Story
          </p>
          <div className="story-headline max-w-[1040px] space-y-2" style={{ color: "#F3ECDF" }}>
            <p className="font-display text-[clamp(1.35rem,2.4vw,2.1rem)] leading-[1.35] tracking-[-0.01em] max-w-[980px]">
              <span>&quot;Filtered with Love&quot;</span> is the foundation of our
              all-day café — born from a mutual love for specialty coffee and
              craft food.
            </p>
          </div>
          <div className="story-divider mt-10 h-px w-full max-w-[980px]" style={{ background: "rgba(243,236,223,0.25)" }} />
        </div>

        {/* vertical timeline */}
        <div className="relative mt-20 lg:mt-28">
          <div className="timeline-track absolute left-6 top-0 h-full w-[3px] rounded-full md:left-1/2 md:-translate-x-1/2">
            <div className="h-full w-full rounded-full" style={{ background: "rgba(243,236,223,0.15)" }} />
            <div
              className="timeline-fill absolute inset-0 origin-top rounded-full"
              style={{
                transform: "scaleY(0)",
                background: "linear-gradient(to bottom, var(--color-brass), var(--color-brass-deep))",
                boxShadow: "0 0 10px rgba(184,147,90,0.25)",
              }}
            />
          </div>

          <div className="space-y-20 md:space-y-28">
            {blocks.map((block, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div key={block.title} className="timeline-item relative pl-16 md:pl-0">
                  {/* badge image on the line */}
                  <div
                    className={`
                      absolute top-0
                      left-6 -translate-x-1/2
                      md:left-1/2 md:-translate-x-1/2
                      z-10 flex items-center justify-center
                    `}
                  >
                    <div className="timeline-ring absolute h-28 w-28 rounded-full border-[1.5px] border-[color:var(--color-brass)]/30" />
                    <div className="timeline-dot h-24 w-24 rounded-full overflow-hidden shadow-[0_0_20px_rgba(184,147,90,0.35)]">
                      <Image
                        src={block.image}
                        alt={block.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* content card */}
                  <div
                    className={`
                      timeline-content
                      md:w-[calc(50%-56px)]
                      ${isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}
                      ${isLeft ? "md:text-right" : "md:text-left"}
                      pt-20 md:pt-2
                    `}
                  >
                    <div className={`flex items-center gap-3 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                      <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-brass-deep)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-[clamp(1.4rem,2.2vw,1.85rem)] font-semibold leading-tight" style={{ color: "#F3ECDF" }}>
                        {block.title}
                      </h3>
                    </div>

                    <div className={`my-4 h-[1.5px] w-12 bg-[color:var(--color-brass)]/40 ${isLeft ? "md:ml-auto" : ""}`} />

                    <div className="space-y-4">
                      {block.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className={`font-sans text-[17px] leading-[1.8] ${isLeft ? "md:ml-auto" : ""} max-w-[52ch]`}
                          style={{ color: "rgba(243,236,223,0.78)" }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-6 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2">
            <div className="h-3.5 w-3.5 rounded-full bg-[color:var(--color-brass-deep)] shadow-[0_0_10px_rgba(184,147,90,0.35)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
