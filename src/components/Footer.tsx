"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CONTACT, LOCATIONS, ORDER_LINKS, SOCIAL_LINKS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/* Shared styles                                                       */
/* ------------------------------------------------------------------ */

const headingClass = `mb-6 font-display text-[clamp(1.4rem,2.2vw,1.75rem)] leading-tight tracking-[-0.01em] text-white`;
const linkClass = `block font-sans text-[14px] leading-[1.7] text-white/85 transition-colors duration-300 hover:text-white`;
const iconLinkClass = `text-white/90 transition-colors duration-300 hover:text-white`;
/* Eyebrow label above a contact value — matches the site's section eyebrows. */
const eyebrowClass = `font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55`;
/* Prominent contact value — serif, like the names/titles used across the site. */
const contactValueClass = `block font-display text-[1.05rem] leading-snug tracking-[0.01em] text-white transition-opacity duration-300 hover:opacity-70`;

/* External-link props, shared by every outbound anchor in the footer. */
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Email",
    href: `mailto:${CONTACT.email}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[26px] w-[26px]" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 5.5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: CONTACT.whatsappLink,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[26px] w-[26px]">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: SOCIAL_LINKS.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[26px] w-[26px]" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: SOCIAL_LINKS.facebook,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[26px] w-[26px]">
        <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.03 1.792-4.703 4.533-4.703 1.313 0 2.686.236 2.686.236v2.973h-1.513c-1.49 0-1.956.93-1.956 1.885v2.272h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.099 24 12.073Z" />
      </svg>
    ),
  },
];

const MARKETPLACES: { label: string; href: string; src: string; width: number; height: number; className: string }[] = [
  { label: "Swiggy", href: ORDER_LINKS.swiggy, src: "/Swiggy.png", width: 120, height: 120, className: "w-[92px]" },
  { label: "Zomato", href: ORDER_LINKS.zomato, src: "/zomato2.png", width: 200, height: 60, className: "w-[96px]" },
];

/* ------------------------------------------------------------------ */
/* Sub-components                                                       */
/* ------------------------------------------------------------------ */

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className={headingClass}>
      <span aria-hidden className="ft-tick mb-2.5 block h-px w-7 origin-left bg-white/40" />
      {children}
    </h4>
  );
}

function LogoColumn() {
  return (
    <div className="ft-col flex items-center justify-center sm:justify-start lg:items-start">
      <Image
        src="/white-teak-logo.png"
        alt="White Teak Coffee Roasters"
        width={500}
        height={500}
        className="h-auto w-[170px] sm:w-[150px] lg:w-[200px]"
      />
    </div>
  );
}

function LocationsColumn() {
  return (
    <div className="ft-col">
      <SectionHeading>Our Locations</SectionHeading>
      <ul className="space-y-4">
        {LOCATIONS.map((loc) => (
          <li key={loc.name}>
            <a href={loc.mapUrl} {...external} className="group block">
              <span className="font-display text-[1.05rem] leading-snug text-white transition-opacity duration-300 group-hover:opacity-70">
                {loc.name}
              </span>
              <span className="mt-0.5 block font-sans text-[12px] tracking-[0.04em] text-white/65">
                {loc.hours}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactColumn() {
  return (
    <div className="ft-col">
      <SectionHeading>Contact Us</SectionHeading>
      <p className={`mb-1 ${eyebrowClass}`}>WhatsApp</p>
      <a href={CONTACT.whatsappLink} {...external} className={`${contactValueClass} whitespace-nowrap`}>
        +91 9731999040
      </a>
      <p className={`mt-4 mb-1 ${eyebrowClass}`}>Email</p>
      <a href={`mailto:${CONTACT.email}`} className={`${contactValueClass} break-all`}>
        {CONTACT.email}
      </a>

      <div className="mt-6 flex items-center gap-4">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} {...external} className={iconLinkClass} aria-label={s.label}>
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

function OrderColumn() {
  return (
    <div className="ft-col">
      <SectionHeading>Order Now</SectionHeading>
      <a
        href={ORDER_LINKS.direct}
        {...external}
        className="group inline-flex items-center gap-2.5 rounded-full bg-[color:var(--color-ivory)] px-7 py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-espresso)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px]" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M6 12v9M17 3c-1.5 0-3 1.8-3 5s1.5 4 3 4v9" />
        </svg>
        Dine In
      </a>
      <div className="mt-6 flex items-center gap-7">
        {MARKETPLACES.map((m) => (
          <a key={m.label} href={m.href} {...external} aria-label={`Order on ${m.label}`} className="transition-opacity hover:opacity-75">
            <Image src={m.src} alt={m.label} width={m.width} height={m.height} className={`h-auto ${m.className}`} />
          </a>
        ))}
      </div>
    </div>
  );
}

function BottomBar() {
  return (
    <div className="ft-bar mt-12 border-t border-white/[0.08] pt-7 lg:mt-16">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <p className="order-2 font-sans text-[11px] tracking-[0.06em] text-white/55 sm:order-1">
          © {new Date().getFullYear()} White Teak Coffee Roasters
        </p>
        <p className="order-3 font-sans text-[11px] tracking-[0.06em] text-white/55 sm:order-2">
          Designed & Managed by{" "}
          <a
            href="https://www.liitmedia.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/75 underline decoration-white/30 underline-offset-2 transition-colors duration-300 hover:text-white hover:decoration-white/60"
          >
            LiitMedia
          </a>
        </p>
        <div className="order-1 flex items-center gap-10 sm:order-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-white/70">
            Privacy Policy
          </span>
          <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-white/70">
            Terms of Service
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });

      // Columns rise and fade in, staggered left-to-right.
      tl.from(".ft-col", {
        opacity: 0,
        y: 28,
        duration: 1,
        stagger: 0.12,
      });

      // Accent ticks draw in from the left, overlapping the columns.
      tl.from(
        ".ft-tick",
        { scaleX: 0, transformOrigin: "left center", duration: 0.7, stagger: 0.12 },
        "-=0.9"
      );

      // Bottom bar settles in last.
      tl.from(
        ".ft-bar",
        { opacity: 0, y: 18, duration: 0.9 },
        "-=0.45"
      );
    },
    { scope: root }
  );

  return (
    <footer
      ref={root}
      id="footer"
      className="border-t border-white/[0.06]"
      style={{ background: "var(--color-ink)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 pt-12 pb-6 lg:px-12 lg:pt-14 lg:pb-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr] lg:gap-16 lg:[&>*:first-child]:mr-16">
          <LogoColumn />
          <LocationsColumn />
          <ContactColumn />
          <OrderColumn />
        </div>
        <BottomBar />
      </div>
    </footer>
  );
}
