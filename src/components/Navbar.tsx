"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NAV_LINKS, MENU_URL } from "@/lib/constants";

const EXTENDED_LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "Story", href: "/#story" },
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
              {EXTENDED_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group relative text-[13px] font-sans font-medium text-white/75 hover:text-white transition-colors tracking-[0.15em] uppercase"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-white origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform duration-500" />
                </a>
              ))}
            </div>

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
