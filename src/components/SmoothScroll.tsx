"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    // Sync Lenis with GSAP's ticker so ScrollTrigger stays in sync
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Route in-page hash links (#hero, #locations, …) through Lenis.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    // On load with a hash (e.g. arriving from /arrivals via /#hero), jump there.
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) requestAnimationFrame(() => lenis.scrollTo(target as HTMLElement, { offset: -80, immediate: true }));
    }

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
