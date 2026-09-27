# Footer Redesign — Design Spec

**Date:** 2026-06-06
**Component:** `src/components/Footer.tsx`
**Reference:** `footer_whiteteak.PNG`

## Goal

Redesign the site footer to match the reference image: a dark, 4-column layout
(Logo · Our Locations · Contact Us · Order Now) over a centered bottom bar with
static "Privacy Policy" and "Terms of Service" text. Reuse all existing data and
hyperlinks from `src/lib/constants.ts`.

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [LOGO]      Our Locations    Contact Us       Order Now          │
│  White Teak   • Gokulam       Whatsapp:        ┌──────────┐       │
│  Coffee        7 AM–11 PM     +919731999040    │ Dine In  │       │
│  Roasters     • Kavi Mane     whiteteak.       └──────────┘       │
│  (logo.png)    11 AM–9 PM     social@...                          │
│               • Sainikpuri    ✉ 🟢 📷 f       [Swiggy] [Zomato]  │
│                7 AM–12 AM                                          │
├─────────────────────────────────────────────────────────────────┤
│           Privacy Policy            Terms of Service              │
└─────────────────────────────────────────────────────────────────┘
```

- Background: `--color-ink` (`#0E0704`) dark footer.
- Desktop: 4-column grid. `md`: 2 columns. Mobile: single stacked column.

## Columns

1. **Logo** — `/assets/logo.png` (circular White Teak Coffee Roasters mark),
   ~150–190px wide, left-aligned, rendered via `next/image`.
2. **Our Locations** — heading + `LOCATIONS` as a bulleted list. Each item shows
   name + hours and links to its `mapUrl` (target=_blank). Hover underline retained.
3. **Contact Us** — "Whatsapp:" label + `CONTACT.whatsapp` (→ `CONTACT.whatsappLink`),
   `CONTACT.email` (→ mailto). Below: a social icon row of **four** — Email (mailto),
   WhatsApp (`whatsappLink`), Instagram (`SOCIAL_LINKS.instagram`),
   Facebook (`SOCIAL_LINKS.facebook`).
4. **Order Now** — a **"Dine In" button** (serif label, cream fill per reference)
   linking to `ORDER_LINKS.direct`. Below: **Swiggy** and **Zomato** logo images
   (`/Swiggy.png`, `/Zomato.png`) linking to `ORDER_LINKS.swiggy` / `ORDER_LINKS.zomato`.

## Bottom bar

- Thin top divider.
- "Privacy Policy" and "Terms of Service" as **static, non-interactive text**
  (serif, centered, two-up). Not links. No red accent line.
- The previous large "WHITE TEAK COFFEE ROASTERS" wordmark + copyright block is removed.

## Constraints

- All hyperlinks come from existing `constants.ts` — nothing hardcoded, nothing lost.
- Only `src/components/Footer.tsx` changes. No constants changes.
- Use `next/image` for logo + marketplace logos.

## Responsive

- `lg`: 4 columns. `md`: 2 columns. Mobile: single column stacked.
- Bottom bar centers/stacks on small screens.
