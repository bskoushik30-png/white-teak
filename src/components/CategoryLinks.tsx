"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CATEGORY_LINKS, MENU_URL } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TAGLINES: Record<string, string> = {
  Coffee: "Single origin pours",
  Breakfast: "Slow mornings",
  Desserts: "Sweet finishes",
  Savoury: "Hearty plates",
  Beverages: "Crafted sips",
};

export default function CategoryLinks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
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
      className="relative py-28 md:py-36"
      style={{ background: "#d4c9a8" }}
    >
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <p className="eyebrow-brass mb-4" style={{ color: "#3D2817" }}>Explore · Savour · Repeat</p>
          <h2 className="display-hero !text-[clamp(2.2rem,5vw,4rem)]" style={{ color: "#1B100A" }}>
            A menu made for{" "}
            <span className="font-script" style={{ color: "#5a3a18" }}>lingering</span>.
          </h2>
        </div>

        <div className="cat-grid flex flex-wrap justify-center gap-x-14 gap-y-14 md:gap-x-20">
          {CATEGORY_LINKS.map((cat, i) => (
            <a
              key={cat.name}
              href={MENU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cat-item group flex flex-col items-center gap-4 relative"
            >
              <div className="relative">
                {/* Decorative ring */}
                <span className="absolute -inset-3 rounded-full border border-dashed border-[color:var(--color-brass)]/0 group-hover:border-[color:var(--color-brass)]/60 group-hover:rotate-180 transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="absolute -inset-1 rounded-full bg-[color:var(--color-brass)]/0 group-hover:bg-[color:var(--color-brass)]/20 blur-xl transition-all duration-700" />
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border border-[color:var(--color-line)] shadow-[0_12px_30px_-10px_rgba(27,16,10,0.25)] relative">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover group-hover:scale-[1.15] transition-transform duration-[900ms] ease-out"
                  />
                  <span className="absolute inset-0 bg-[color:var(--color-espresso)]/0 group-hover:bg-[color:var(--color-espresso)]/20 transition-colors" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[color:var(--color-espresso)] text-[color:var(--color-ivory)] text-[10px] font-medium tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-500">
                  0{i + 1}
                </span>
              </div>
              <div className="text-center">
                <p className="font-display text-xl md:text-2xl text-[color:var(--color-espresso)] leading-none">
                  {cat.name}
                </p>
                <p className="eyebrow !text-[10px] mt-2.5">{TAGLINES[cat.name] ?? "Explore"}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
