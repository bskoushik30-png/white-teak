"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionMediaItem } from "@/types/database";
import { DEFAULT_SECTION_MEDIA } from "@/lib/supabase/media-defaults";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DISHES = [
  "Fresh Mango Cake",
  "Fresh Mango Cheesecake",
  "Mango Matcha Latte",
  "Mango White Chocolate French Toast",
  "Mango White Chocolate Pancake",
  "Mango White Chocolate Waffle",
  "Mango Yogurt Granola Bowl",
  "Mango Sticky Oats",
  "Mango Coconut Oats Bowl",
  "Raw Mango & Papaya Salad",
  "Mango Brownie Crumble",
];

export default function ArrivalsSection({
  media = DEFAULT_SECTION_MEDIA.arrivals,
}: {
  media?: SectionMediaItem[];
}) {
  const root = useRef<HTMLElement>(null);

  const dishesMedia = media?.find((m) => m.item_key === "arrivals_dishes");
  const titleMedia = media?.find((m) => m.item_key === "arrivals_title");
  const branchMedia = media?.find((m) => m.item_key === "arrivals_branch");

  const dishesImg = dishesMedia?.image_url || "/mango-dishes.png";
  const titleImg = titleMedia?.image_url || "/summer-affair-title-cropped.png";
  const branchImg = branchMedia?.image_url || "/mango-branch.png";

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });

      tl.from(".mango-branch", {
        y: -60,
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
      })
        .from(".sa-title", { x: -50, opacity: 0, duration: 1 }, "-=0.7")
        .from(
          ".dish-item",
          { x: -24, opacity: 0, stagger: 0.07, duration: 0.5 },
          "-=0.4"
        )
        .from(
          ".dishes-photo",
          { scale: 0.9, opacity: 0, duration: 1.1, ease: "expo.out" },
          "-=0.9"
        );

      gsap.to(".mango-branch", {
        rotate: 2,
        transformOrigin: "top right",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: root }
  );

  return (
    <section
      id="arrivals"
      ref={root}
      className="relative overflow-hidden pt-6 pb-20 lg:pt-8 lg:pb-28"
      style={{ background: "transparent" }}
    >
      {/* Mango branch — top-right corner */}
      <Image
        src={branchImg}
        alt={branchMedia?.title || "Mango Branch"}
        aria-hidden
        width={800}
        height={500}
        className="mango-branch pointer-events-none absolute right-0 top-0 w-[68%] max-w-[900px] select-none"
      />

      <div className="relative w-full px-6 lg:px-16">
        {/* Summer Affair title */}
        <Image
          src={titleImg}
          alt={titleMedia?.title || "The Summer Affair"}
          width={1139}
          height={685}
          className="sa-title relative z-10 w-[140px] sm:w-[200px] lg:w-[270px] xl:w-[300px]"
        />

        {/* Two-column layout: dish list left, photo right */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-[minmax(300px,400px)_1fr] lg:gap-12 lg:items-center">
          {/* Dish list */}
          <ul className="space-y-2">
            {DISHES.map((dish) => (
              <li
                key={dish}
                className="dish-item font-display text-[1.2rem] font-semibold leading-snug text-[#5A2E12] sm:text-[1.4rem] lg:text-[1.7rem]"
              >
                {dish}
              </li>
            ))}
            <li className="dish-item pl-5 font-display text-[1.05rem] text-[#7A3B1E] sm:text-[1.2rem] lg:text-[1.45rem]">
              — with ice cream
            </li>
          </ul>

          {/* Photo */}
          <div className="dishes-photo w-full">
            <Image
              src={dishesImg}
              alt={dishesMedia?.title || "Mango dish collection"}
              width={1200}
              height={680}
              className="h-auto w-full drop-shadow-[0_24px_48px_rgba(120,70,10,0.28)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
