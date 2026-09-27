"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NAV_LINKS, MENU_URL } from "@/lib/constants";

const EXTENDED_LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "Story", href: "/#story" },
  { label: "Arrivals", href: "/arrivals" },
  { label: "Menu", href: MENU_URL, external: true },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Locations", href: "/#locations" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setProgress(height > 0 ? scrolled / height : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reference NAV_LINKS for compat
  void NAV_LINKS;

  return (
    <>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
      />



      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-md border-b border-white/10 shadow-lg"
            : ""
        }`}
        style={{ background: scrolled ? "rgba(15, 10, 7, 0.75)" : "transparent" }}
      >
        <div className="max-w-[1400px] mx-auto pl-0 pr-2 lg:pl-0 lg:pr-4">
          <div className="flex items-center justify-between h-24">
            {/* Logo + Brand */}
            <a href="/#hero" className="flex items-center gap-2 group">
              <Image
                src="/assets/logo.png"
                alt="White Teak Logo"
                width={72}
                height={80}
                className="object-contain brightness-0 invert"
              />
              <span className="hidden sm:block text-[16px] tracking-[0.18em] text-white font-bold" style={{ fontFamily: "var(--font-logo)" }}>
                WHITE TEAK COFFEE ROASTERS
              </span>
            </a>

            {/* Nav links — desktop */}
            <div className="hidden md:flex items-center gap-10">
              {EXTENDED_LINKS.map((link) => {
                const isArrivals = link.label === "Arrivals";
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`group relative text-[13px] font-sans transition-colors tracking-[0.15em] uppercase ${
                      isArrivals
                        ? "font-bold text-white drop-shadow-[0_0_10px_rgba(255,203,45,0.8)] hover:text-[#FFCB2D]"
                        : "font-medium text-white/75 hover:text-white"
                    }`}
                  >
                    {isArrivals && (
                      <span className="arrivals-cursor-wrap" aria-hidden="true">
                        <svg
                          className="arrivals-cursor"
                          width="20"
                          height="22"
                          viewBox="0 0 20 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 1L17.5 11.5L10.5 12.8L14 20L11.5 21L8 13.5L2 17.5L4 1Z"
                            fill="#D4B487"
                            stroke="#1B100A"
                            strokeWidth="0.8"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="arrivals-click-ring" />
                      </span>
                    )}
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-white origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform duration-500" />
                  </a>
                );
              })}
            </div>

            <style>{`
              .arrivals-cursor-wrap {
                position: absolute;
                top: calc(100% + 6px);
                left: 50%;
                transform: translateX(-20%);
                pointer-events: none;
                display: flex;
                align-items: flex-start;
                justify-content: center;
              }

              .arrivals-cursor {
                filter: drop-shadow(0 2px 6px rgba(184,147,90,0.7));
                animation: arrivals-bob 1.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
                transform-origin: top left;
              }

              .arrivals-click-ring {
                position: absolute;
                top: 2px;
                left: 4px;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                border: 1.5px solid #D4B487;
                animation: arrivals-ring 1.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
                opacity: 0;
              }

              @keyframes arrivals-bob {
                0%   { transform: translateY(0px) rotate(-10deg); }
                40%  { transform: translateY(6px) rotate(-6deg); }
                50%  { transform: translateY(8px) rotate(-4deg) scale(0.9); }
                60%  { transform: translateY(6px) rotate(-6deg) scale(1); }
                100% { transform: translateY(0px) rotate(-10deg); }
              }

              @keyframes arrivals-ring {
                0%   { opacity: 0; transform: scale(0.5); }
                45%  { opacity: 0; transform: scale(0.5); }
                55%  { opacity: 0.9; transform: scale(1); }
                80%  { opacity: 0; transform: scale(2.2); }
                100% { opacity: 0; transform: scale(2.2); }
              }

              .arrivals-label {
                position: relative;
                display: inline-block;
              }

              .arrivals-glow {
                position: absolute;
                inset: -6px -10px;
                border-radius: 6px;
                background: radial-gradient(ellipse at center, rgba(184,147,90,0.18) 0%, transparent 70%);
                animation: arrivals-pulse 1.8s ease-in-out infinite;
                pointer-events: none;
              }

              @keyframes arrivals-pulse {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50%       { opacity: 1;   transform: scale(1.08); }
              }
            `}</style>

            {/* Hamburger — mobile */}
            <button
              className="md:hidden p-2.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={`block h-[1.5px] bg-white transition-transform duration-300 ${
                    menuOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`block h-[1.5px] bg-white transition-opacity duration-300 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-[1.5px] bg-white transition-transform duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[color:var(--color-ivory)]/95 backdrop-blur-xl border-t border-[color:var(--color-line)]/60">
            <div className="px-6 py-6 flex flex-col gap-1">
              {EXTENDED_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-left text-sm font-sans text-[color:var(--color-walnut)] uppercase tracking-[0.22em] hover:text-[color:var(--color-espresso)] transition-all border-b border-[color:var(--color-line)]/40"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
