# Footer Redesign — Design Spec

Date: 2026-06-05
Component: `src/components/Footer.tsx`

## Goal

Restructure and polish the site footer. Keep all existing content but rework the
structure (add quick nav + directions link) and elevate the visual treatment to
match the warm, editorial, brass-accented coffee-roaster design language. Motion
is intentionally subtle.

## Context

- The footer sits on a near-black background (`#080503` → `#000000`) painted by
  `ScrollGradient` for the `#footer` section. Footer itself is `transparent`.
- Text is ivory (`--color-ivory: #F3ECDF`). Brass accents available
  (`--color-brass: #B8935A`, `--color-brass-deep`, `--color-brass-soft`).
- Serif display font (`--font-display`, Fraunces), sans (`--font-sans`, Inter).
- Existing utilities to reuse: `link-brass`, `eyebrow`, color tokens. A paper
  grain + vignette overlay already covers the page via `body::before/::after`.
- Data comes from `@/lib/constants`: `CONTACT`, `ORDER_LINKS`, `SOCIAL_LINKS`,
  `MENU_URL`, `MAPS_URL`.

## Structure (top → bottom)

1. **Top band** — brand lockup + tagline (left) | quick nav (right)
   - Left: small serif "White Teak" lockup with one-line tagline
     ("Specialty coffee, roasted in Mysuru.").
   - Right: quick nav as a stacked list — Home (`#hero`), Menu (`MENU_URL`,
     opens new tab), Contact (`#footer`). Brass underline-on-hover.

2. **Three-column info row**
   - **Visit** — `CONTACT.hours` + `CONTACT.address` + "Get Directions →"
     link to `MAPS_URL` (arrow nudges on hover).
   - **Contact** — WhatsApp (`CONTACT.whatsappLink` / `.whatsapp`) and email
     (`mailto:CONTACT.email`), each a row with a small icon.
   - **Order** — Zomato + Swiggy badges with a subtle hover lift.
   - Each column has an eyebrow-style label + serif heading + refined icon.
   - Hairline brass-tinted dividers between columns (low-alpha brass).

3. **Socials + copyright row**
   - Hairline divider, then a row: Instagram/Facebook icons (circular hover
     ring) on one side, copyright text on the other.

4. **Closing brand wordmark**
   - Oversized serif `WHITE TEAK COFFEE ROASTERS®` as the closing moment.
   - Thin brass hairline above it, tighter tracking, cleanly aligned ®.

## Motion (subtle)

- One soft fade-up reveal of the footer content on scroll into view via GSAP
  `ScrollTrigger` + `useGSAP`. Respect `prefers-reduced-motion` (no animation,
  content visible).
- Hover-only micro-interactions (pure CSS): brass underline grow on links,
  arrow nudge on "Get Directions", opacity/ring on socials, gentle lift on
  order badges. No looping animation.

## Technical

- Single `Footer.tsx`. Becomes a client component (`"use client"`) to host the
  GSAP reveal; all styling stays Tailwind + existing CSS utilities.
- Reuse existing tokens. Where `link-brass` assumes dark text on light bg,
  use inline dark-bg-friendly variants (ivory text, brass underline).
- Responsive: columns stack to single column on mobile; nav wraps under the
  brand; wordmark scales with existing `clamp()`.
- Accessibility: keep `aria-label`s on icon links, keep semantic `<footer>`,
  external links keep `target="_blank" rel="noopener noreferrer"`.

## Out of scope

- No changes to `ScrollGradient`, constants, or other components.
- No new dependencies (GSAP/ScrollTrigger already installed).
