"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * GSAP scroll-animated gradient — near-solid variant.
 *
 * Each section is rendered as an almost-solid colour with a very subtle
 * radial vignette for depth. GSAP tweens the colour channels with
 * power1.inOut easing for silky-smooth transitions between sections.
 * scrub: 1.5 adds extra smoothing so the colour shift feels organic.
 */

/* ─── Hex → RGB helper ─── */
function hex(h: string): [number, number, number] {
  const c = h.replace("#", "");
  return [
    parseInt(c.substring(0, 2), 16),
    parseInt(c.substring(2, 4), 16),
    parseInt(c.substring(4, 6), 16),
  ];
}

/* ─── Gradient keyframes: one per section ─── */
interface ColorState {
  tR: number; tG: number; tB: number; // top
  mR: number; mG: number; mB: number; // mid
  bR: number; bG: number; bB: number; // bottom
}

function makeState(top: string, mid: string, bot: string): ColorState {
  const [tR, tG, tB] = hex(top);
  const [mR, mG, mB] = hex(mid);
  const [bR, bG, bB] = hex(bot);
  return { tR, tG, tB, mR, mG, mB, bR, bG, bB };
}

/**
 * Section definitions: selector + near-solid colours.
 * top/mid/bottom are very close for a solid feel with subtle depth.
 * The order must match the DOM order on the page.
 */
const SECTIONS = [
  // Hero — dark (matching hero background)
  { sel: "#hero",                        ...makeState("#140d09", "#110b07", "#0d0805") },
  // The Table — olive green (solid feel)
  { sel: "main > section:nth-child(2)",  ...makeState("#465a18", "#4a5e17", "#425615") },
  // Ambience — deep crimson (solid feel)
  { sel: "#nature",                      ...makeState("#7a1a16", "#7d1713", "#711512") },
  // Story — warm sand (solid feel)
  { sel: "#story",                       ...makeState("#bdb08a", "#b8aa84", "#b0a37e") },
  // Farm — roasted brown (solid feel)
  { sel: "main > section:nth-child(5)",  ...makeState("#86593b", "#815638", "#7a5135") },
  // Feature Cards — roasted brown (solid feel)
  { sel: "main > section:nth-child(6)",  ...makeState("#55372a", "#4d3324", "#3a2218") },
  // Reviews — dark brown (solid feel)
  { sel: "#testimonials",                ...makeState("#2e1d16", "#2b1a14", "#281812") },
  // Footer — near-black coffee (solid)
  { sel: "#footer",                      ...makeState("#1d120d", "#1a0f0b", "#170d09") },
];

export default function ScrollGradient() {
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = layerRef.current;
    if (!el) return;

    // Proxy object that GSAP tweens — holds the current RGB channels
    const proxy: ColorState = { ...SECTIONS[0] };

    // Render a fully solid bg using the mid colour to avoid any visible banding
    const render = () => {
      const m = `rgb(${Math.round(proxy.mR)},${Math.round(proxy.mG)},${Math.round(proxy.mB)})`;
      el.style.background = m;
    };

    // Set initial gradient
    render();

    // Apply a colour state to the proxy (no tween — used for instant snaps).
    const apply = (s: ColorState) => {
      Object.assign(proxy, s);
      render();
    };

    // One ScrollTrigger per section boundary. Each fires when that section's
    // TOP crosses the middle of the viewport, tweening to that section's colour.
    // This uses each element's REAL position (immune to smooth-scroll/weight
    // mismeasurement), so the yellow band reliably covers Events → Arrivals.
    const triggers = SECTIONS.map((sec, i) => {
      const target = document.querySelector(sec.sel) as HTMLElement | null;
      if (!target) return null;

      const colorTo = () =>
        gsap.to(proxy, {
          tR: sec.tR, tG: sec.tG, tB: sec.tB,
          mR: sec.mR, mG: sec.mG, mB: sec.mB,
          bR: sec.bR, bG: sec.bG, bB: sec.bB,
          duration: 0.6,
          ease: "power1.inOut",
          overwrite: "auto",
          onUpdate: render,
        });

      // Previous section's colour, for scrolling back up past this boundary.
      const prev = SECTIONS[i - 1];
      const colorBack = () =>
        prev &&
        gsap.to(proxy, {
          tR: prev.tR, tG: prev.tG, tB: prev.tB,
          mR: prev.mR, mG: prev.mG, mB: prev.mB,
          bR: prev.bR, bG: prev.bG, bB: prev.bB,
          duration: 0.6,
          ease: "power1.inOut",
          overwrite: "auto",
          onUpdate: render,
        });

      return ScrollTrigger.create({
        trigger: target,
        start: "top 55%",
        onEnter: colorTo,
        onEnterBack: colorTo,
        onLeaveBack: colorBack,
      });
    });

    // Re-measure once layout has settled (images, fonts, smooth-scroll).
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
      triggers.forEach((tr) => tr?.kill());
    };
  });

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
