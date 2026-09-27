# White Teak Coffee Roasters — Full Rebuild Blueprint

> Generated 2026-04-21 from live site https://www.whiteteakroasters.com/
> All textual content, asset mappings, links, and complete component code below.

---

## Table of Contents

1. [Site Structure Overview](#1-site-structure-overview)
2. [All Textual Content (Scraped)](#2-all-textual-content)
3. [Asset Inventory & Downloads](#3-asset-inventory)
4. [External Links & URLs](#4-external-links)
5. [File Changes — Complete Code](#5-file-changes)
   - [5.1 `src/app/layout.tsx`](#51-layout)
   - [5.2 `src/app/page.tsx`](#52-page)
   - [5.3 `src/app/globals.css`](#53-globals-css)
   - [5.4 `src/lib/constants.ts`](#54-constants)
   - [5.5 `src/components/Navbar.tsx`](#55-navbar)
   - [5.6 `src/components/HeroSection.tsx`](#56-herosection)
   - [5.7 `src/components/FoodGallery.tsx`](#57-foodgallery) *(new)*
   - [5.8 `src/components/CategoryLinks.tsx`](#58-categorylinks) *(new)*
   - [5.9 `src/components/NatureSection.tsx`](#59-naturesection) *(new)*
   - [5.10 `src/components/StorySection.tsx`](#510-storysection)
   - [5.11 `src/components/FarmSection.tsx`](#511-farmsection) *(new)*
   - [5.12 `src/components/FeatureCards.tsx`](#512-featurecards) *(new)*
   - [5.13 `src/components/Footer.tsx`](#513-footer)

---

## 1. Site Structure Overview

The live site (Wix-based) has these sections top-to-bottom:

```
┌─────────────────────────────────────────┐
│ NAVBAR (sticky)                         │
│   Logo + "WHITE TEAK COFFEE ROASTERS®"  │
│   Links: Home | Contact Us              │
├─────────────────────────────────────────┤
│ HERO SECTION                            │
│   Left: headline + subtitle + CTA       │
│   Right: auto-playing video (muted)     │
├─────────────────────────────────────────┤
│ "Crafted Food and Drinks" heading       │
│   Scrollable food image gallery         │
├─────────────────────────────────────────┤
│ CATEGORY LINKS (5 round icons)          │
│   Coffee | Breakfast | Desserts |       │
│   Savoury | Beverages                   │
├─────────────────────────────────────────┤
│ NATURE'S EMBRACE                        │
│   Heading + image carousel (3 images)   │
├─────────────────────────────────────────┤
│ OUR STORY (long text section)           │
│   The Coffee / The Teas / The Bakes /   │
│   Home Brewing / Events & Experiences   │
├─────────────────────────────────────────┤
│ FARM SECTION                            │
│   "From Heart to Hands, Farm to Cup"    │
│   Image carousel (3 farm images)        │
├─────────────────────────────────────────┤
│ FEATURE CARDS (4 cards)                 │
│   Handpicked Specialty Coffee           │
│   Brewing Adventures                    │
│   Freshly Baked Goodness                │
│   Natural Oasis                         │
├─────────────────────────────────────────┤
│ FOOTER                                  │
│   Social bar, Contact info, Order links │
│   Copyright                             │
│   "WHITE TEAK COFFEE ROASTERS®"         │
└─────────────────────────────────────────┘
```

---

## 2. All Textual Content

### Navbar
- Brand: `WHITE TEAK COFFEE ROASTERS®️`
- Nav links: `Home`, `Contact Us`

### Hero Section
- Headline: `Where Coffee and Cuisine harmonize with beauty of nature`
- Subtitle paragraph 1: `Discover White Teak Coffe Roasters, a haven where the art of specialty coffee and the craft of delectable food unite weaving tapestry of an unforgettable`
- Subtitle paragraph 2: `all-day cafe cafe experience`
- CTA button: `Explore Today`
- CTA link: `https://www.google.com/maps/dir//D13%2FB,+Gokulam+Main+Rd,+Vani+Vilas+Mohalla,+Mysuru,+Karnataka+570002/@12.3282263,76.5461313,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3baf7b6d8a3f990f:0xab0db788a2ac2962!2m2!1d76.6285332!2d12.3282387?entry=ttu`

### Crafted Food and Drinks
- Heading: `Crafted Food and Drinks`
- Subheading: `Each item on our menu is crafted with love and care`

### Category Links
All link to: `https://whiteteak.dotpe.in/catalog/499195/568418`
1. `Coffee`
2. `Breakfast`
3. `Desserts`
4. `Savoury`
5. `Beverages`

### Nature's Embrace
- Heading: `Nature's Embrace`
- Subheading: `Escape to Serenity: A Dining Experience Enveloped in Nature's Warmth`

### Our Story

**Title:** `Our Story`

**Intro:** `"Filtered with Love" : being the foundation for our All-day Cafe born out of a mutual love for specialty coffee and craft food.`

**The Coffee:**
> Along with being our founding-planter, we have chosen to work in direct trade relationships at origin with coffee estates and smallholder farmers harvesting and processing coffees that we aim to curate into only SCA 85+ point scoring coffees.

> We pride with our intentional introduction of White Teak "Cascara" (coffee cherry tea) which is the dried skin of coffee cherries which you can brew as you would any other specialty tea.

**The Teas:**
> We source teas direct from farmers and craft them into unique blends. We take pride in our sourcing. Our teas are crafted in small batches - We never compromise on freshness. We never choose flavors over health - 100% natural ingredients always.

**The Bakes:** *(appears twice on original site with same text)*
> We source teas direct from farmers and craft them into unique blends. We take pride in our sourcing. Our teas are crafted in small batches - We never compromise on freshness. We never choose flavors over health - 100% natural ingredients always.

**Home Brewing Experiences:**
> A curated collection of brewing equipment's, ideal for coffee enthusiasts and novices alike.

**Events & Experiences:**
> The White Teak Ambience strives to showcase the Indian subcontinent at its peak for specialty coffee, craft bakes and innovative design. We bring together communities across the various walks of life, through specially curated events and experiences.

> "We feel that an organic and natural extension of our philosophy to help spur an ecosystem to pair such deliciousness with other indigenous talent of the subcontinent that we feel strongly have not yet gotten their fair due: visual artists, designers, musicians, and social changemakers. We're humbled by the sheer number of these folks producing world-class work in our region."

**Closing quote:**
> "Brewing Experiences" : The Food, Coffee, Teas and Ambience make for a great experience. White Teak will inspire you, on every occasion.

### Farm Section
- Heading: `From Heart to Hands, Farm to Cup`
- Subheading: `Our Coffee Farms Nestled in Nature's Embrace`

### Feature Cards (4 cards)
1. **Handpicked Specialty Coffee**
   Subtitle: `From Farm to Your Cup`

2. **Brewing adventures**
   Subtitle: `Explore our curated collection of brewing equipment`

3. **Freshly Baked Goodness**
   Subtitle: `A Perfect Harmony with Our Coffee`

4. **Natural Oasis**
   Subtitle: `Immerse yourself in the tranquility of nature at our cafe`

### Footer

**Social Bar:**
- Instagram: `https://www.instagram.com/whiteteakroasters/?hl=en`
- Facebook: `https://www.facebook.com/whiteteakroasters/`

**Find your way here:**
- Hours: `Everyday: 8:30 am to 11 pm`
- Address: `D13/B, Gokulam Main Rd, Vani Vilas Mohalla, Mysuru, Karnataka 570002`

**Contact Us:**
- WhatsApp: `+919731999040`
- Email: `whiteteak.social@gmail.com`

**Order Now:**
- Direct: `https://whiteteak.dotpe.in/catalog/499195/568418`
- Zomato: `https://www.zomato.com/mysore/white-teak-coffee-roasters-gokulam`
- Swiggy: `https://www.swiggy.com/restaurants/white-teak-coffee-roasters-gokulam-main-road-mysore-north-mysore-715606`

**Copyright:** `©Copyright 2024. White Teak Coffee Roasters. All Rights Reserved.`

**Bottom brand:** `WHITE TEAK COFFEE ROASTERS®️`

---

## 3. Asset Inventory

All assets have been downloaded to `public/assets/`. Here's the full map:

### Logo
| File | Path |
|------|------|
| Logo PNG | `/assets/logo.png` |

### Hero
| File | Path |
|------|------|
| Hero video (480p MP4) | `/assets/hero/hero-video.mp4` |
| Video thumbnail | `/assets/hero/video-thumb.jpg` |

Video source URL (if you need to re-download):
- 480p: `https://video.wixstatic.com/video/d15c6e_e38274a725f8484babda51460a2bfe75/480p/mp4/file.mp4`
- 1080p: `https://video.wixstatic.com/video/d15c6e_e38274a725f8484babda51460a2bfe75/1080p/mp4/file.mp4`

### Food Gallery (scrollable food images)
| File | Path | Source |
|------|------|--------|
| Food 1 | `/assets/food-gallery/food-1.jpg` | `d15c6e_87ed1eb9...` |
| Food 2 | `/assets/food-gallery/food-2.jpg` | `d15c6e_ef522c00...` |
| Food 3 | `/assets/food-gallery/food-3.jpg` | `d15c6e_2eafb469...` |
| Food 4 | `/assets/food-gallery/food-4.jpg` | `d15c6e_97ccff3d...` |
| Food 5 | `/assets/food-gallery/food-5.jpg` | `d15c6e_e6b89f7f...` |
| Food 6 | `/assets/food-gallery/food-6.jpg` | `d15c6e_16fdd1c5...` |

### Category Icons (round thumbnails)
| File | Path |
|------|------|
| Coffee | `/assets/categories/coffee.jpg` |
| Breakfast | `/assets/categories/breakfast.jpg` |
| Desserts | `/assets/categories/desserts.jpg` |
| Savoury | `/assets/categories/savoury.jpg` |
| Beverages | `/assets/categories/beverages.jpg` |

### Nature's Embrace Gallery
| File | Path |
|------|------|
| Nature 1 (storefront) | `/assets/nature/nature-1.jpg` |
| Nature 2 (outdoor seating) | `/assets/nature/nature-2.jpg` |
| Nature 3 (garden view) | `/assets/nature/nature-3.jpg` |

### Farm Gallery
| File | Path |
|------|------|
| Farm 1 | `/assets/farm/farm-1.jpg` |
| Farm 2 | `/assets/farm/farm-2.jpg` |
| Farm 3 | `/assets/farm/farm-3.jpg` |

### Feature Card Images
| File | Path |
|------|------|
| Feature 1 | `/assets/features/feature-1.jpg` |
| Feature 2 | `/assets/features/feature-2.jpg` |
| Feature 3 | `/assets/features/feature-3.jpg` |

### Full Wix Image URLs (for re-downloading at higher res)

```
# Logo
https://static.wixstatic.com/media/d15c6e_493f61dca9ce45d89279250f2fd85d87~mv2.png/v1/fill/w_93,h_103,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/White%20Teak%20Logo-Transparent%20Background.png

# Food gallery (change w_ and h_ for different sizes)
https://static.wixstatic.com/media/d15c6e_87ed1eb9d5db4233983af47094f6e92a~mv2.jpg/v1/fit/w_960,h_960,q_90/d15c6e_87ed1eb9d5db4233983af47094f6e92a~mv2.jpg
https://static.wixstatic.com/media/d15c6e_ef522c00529c4b1faf8b493c3b0f63a7~mv2.jpg/v1/fit/w_960,h_960,q_90/d15c6e_ef522c00529c4b1faf8b493c3b0f63a7~mv2.jpg
https://static.wixstatic.com/media/d15c6e_2eafb469ce954cdba795fbc44f7e0d63~mv2.jpg/v1/fit/w_960,h_960,q_90/d15c6e_2eafb469ce954cdba795fbc44f7e0d63~mv2.jpg
https://static.wixstatic.com/media/d15c6e_97ccff3d05a04bac852252dda601abef~mv2.jpg/v1/fit/w_960,h_960,q_90/d15c6e_97ccff3d05a04bac852252dda601abef~mv2.jpg
https://static.wixstatic.com/media/d15c6e_e6b89f7f3b114ec99f0c8b6f454f33ab~mv2.jpg/v1/fit/w_960,h_960,q_90/d15c6e_e6b89f7f3b114ec99f0c8b6f454f33ab~mv2.jpg
https://static.wixstatic.com/media/d15c6e_16fdd1c551f54d5882fafe97629b66f5~mv2.jpg/v1/fit/w_960,h_960,q_90/d15c6e_16fdd1c551f54d5882fafe97629b66f5~mv2.jpg

# Category icons
https://static.wixstatic.com/media/d15c6e_4f00e2e089a4447489363cb978444eda~mv2.jpg/v1/fill/w_114,h_114,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/21.jpg
https://static.wixstatic.com/media/d15c6e_e6b89f7f3b114ec99f0c8b6f454f33ab~mv2.jpg/v1/fill/w_114,h_114,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/44.jpg
https://static.wixstatic.com/media/d15c6e_2eb5acf6228c4abb974dd06cf34c3f34~mv2.jpg/v1/fill/w_114,h_114,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/41.jpg
https://static.wixstatic.com/media/d15c6e_363eef5b577c4c7c80d2fc41ac68ecd6~mv2.jpg/v1/crop/x_0,y_250,w_5464,h_5423/fill/w_114,h_114,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/29.jpg
https://static.wixstatic.com/media/d15c6e_7468723e5a524225b62d111b1278dc01~mv2.jpg/v1/fill/w_114,h_114,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/43.jpg

# Nature gallery
https://static.wixstatic.com/media/d15c6e_afa364b034ee4455bf9f39786c3a62ac~mv2.jpg/v1/fit/w_480,h_639,q_90/d15c6e_afa364b034ee4455bf9f39786c3a62ac~mv2.jpg
https://static.wixstatic.com/media/d15c6e_89c02acf00474d78b7827c3a9e980858~mv2.jpg/v1/fit/w_960,h_640,q_90/d15c6e_89c02acf00474d78b7827c3a9e980858~mv2.jpg
https://static.wixstatic.com/media/d15c6e_8a6e4086baf94d2bbc07481d5fd736c1~mv2.jpg/v1/fit/w_960,h_661,q_90/d15c6e_8a6e4086baf94d2bbc07481d5fd736c1~mv2.jpg

# Farm gallery
https://static.wixstatic.com/media/d15c6e_0ecc088845f44e89aabd4d0e9ec4090b~mv2.jpg/v1/fit/w_960,h_640,q_90/d15c6e_0ecc088845f44e89aabd4d0e9ec4090b~mv2.jpg
https://static.wixstatic.com/media/d15c6e_a82e334082f64daaa5383a6fb66e9a9f~mv2.jpg/v1/fit/w_480,h_539,q_90/d15c6e_a82e334082f64daaa5383a6fb66e9a9f~mv2.jpg
https://static.wixstatic.com/media/d15c6e_8f6b8882ee10432cbcedd4bf787414ed~mv2.jpg/v1/fit/w_960,h_639,q_90/d15c6e_8f6b8882ee10432cbcedd4bf787414ed~mv2.jpg

# Feature cards
https://static.wixstatic.com/media/d15c6e_c9739fa558e64100966db0d970b0bb6f~mv2.jpg/v1/fit/w_480,h_271,q_90/d15c6e_c9739fa558e64100966db0d970b0bb6f~mv2.jpg
https://static.wixstatic.com/media/d15c6e_06f8f578e57b48f4bd404e99e780eec7~mv2.jpg/v1/fit/w_480,h_271,q_90/d15c6e_06f8f578e57b48f4bd404e99e780eec7~mv2.jpg
https://static.wixstatic.com/media/d15c6e_4f00e2e089a4447489363cb978444eda~mv2.jpg/v1/fit/w_480,h_271,q_90/d15c6e_4f00e2e089a4447489363cb978444eda~mv2.jpg
```

---

## 4. External Links

| Purpose | URL |
|---------|-----|
| Google Maps Directions | `https://www.google.com/maps/dir//D13%2FB,+Gokulam+Main+Rd,+Vani+Vilas+Mohalla,+Mysuru,+Karnataka+570002/@12.3282263,76.5461313,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3baf7b6d8a3f990f:0xab0db788a2ac2962!2m2!1d76.6285332!2d12.3282387?entry=ttu` |
| Online Menu (DotPe) | `https://whiteteak.dotpe.in/catalog/499195/568418` |
| Instagram | `https://www.instagram.com/whiteteakroasters/?hl=en` |
| Facebook | `https://www.facebook.com/whiteteakroasters/` |
| WhatsApp | `https://wa.me/919154990266?text=` |
| Email | `mailto:whiteteak.social@gmail.com` |
| Zomato | `https://www.zomato.com/mysore/white-teak-coffee-roasters-gokulam` |
| Swiggy | `https://www.swiggy.com/restaurants/white-teak-coffee-roasters-gokulam-main-road-mysore-north-mysore-715606` |

---

## 5. File Changes — Complete Code

### Existing stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4 (with `@import "tailwindcss"` and `@theme inline`)
- GSAP + @gsap/react + framer-motion
- Fonts: Fraunces (serif/display), Inter (sans)

### Files to DELETE (no longer needed)
- `src/components/BeanMorph.tsx`
- `src/components/FloatingParticles.tsx`
- `src/components/Marquee.tsx`
- `src/components/NewsletterSection.tsx`
- `src/components/ScrollGradientBackground.tsx`
- `src/components/ScrollTrack/` (entire directory)
- `src/components/TestimonialsSection.tsx`
- `src/hooks/` (if only scroll-track related)

---

### 5.1 Layout

**File:** `src/app/layout.tsx`
**Action:** MODIFY — keep Fraunces + Inter, update metadata

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home | White Teak Coffee",
  description:
    "Where Coffee and Cuisine harmonize with beauty of nature. Discover White Teak Coffee Roasters — specialty coffee, craft food, all-day cafe experience in Mysuru.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

---

### 5.2 Page

**File:** `src/app/page.tsx`
**Action:** REWRITE — new section order matching live site

```tsx
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FoodGallery from "@/components/FoodGallery";
import CategoryLinks from "@/components/CategoryLinks";
import NatureSection from "@/components/NatureSection";
import StorySection from "@/components/StorySection";
import FarmSection from "@/components/FarmSection";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FoodGallery />
        <CategoryLinks />
        <NatureSection />
        <StorySection />
        <FarmSection />
        <FeatureCards />
      </main>
      <Footer />
    </>
  );
}
```

---

### 5.3 Globals CSS

**File:** `src/app/globals.css`
**Action:** MODIFY — keep existing warm palette, add new utilities. The existing file is mostly fine. Add these at the bottom if not present:

```css
/* Add to existing globals.css — after existing content */

/* Image carousel fade edges */
.fade-edges {
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

/* Smooth image carousel scroll */
.scroll-smooth-x {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.scroll-smooth-x::-webkit-scrollbar {
  display: none;
}
```

---

### 5.4 Constants

**File:** `src/lib/constants.ts`
**Action:** REWRITE

```ts
export const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Contact Us", href: "#footer" },
];

export const CATEGORY_LINKS = [
  { name: "Coffee", image: "/assets/categories/coffee.jpg" },
  { name: "Breakfast", image: "/assets/categories/breakfast.jpg" },
  { name: "Desserts", image: "/assets/categories/desserts.jpg" },
  { name: "Savoury", image: "/assets/categories/savoury.jpg" },
  { name: "Beverages", image: "/assets/categories/beverages.jpg" },
];

export const MENU_URL = "https://whiteteak.dotpe.in/catalog/499195/568418";

export const MAPS_URL =
  "https://www.google.com/maps/dir//D13%2FB,+Gokulam+Main+Rd,+Vani+Vilas+Mohalla,+Mysuru,+Karnataka+570002/@12.3282263,76.5461313,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3baf7b6d8a3f990f:0xab0db788a2ac2962!2m2!1d76.6285332!2d12.3282387?entry=ttu";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/whiteteakroasters/?hl=en",
  facebook: "https://www.facebook.com/whiteteakroasters/",
};

export const CONTACT = {
  whatsapp: "+919731999040",
  whatsappLink: "https://wa.me/919154990266?text=",
  email: "whiteteak.social@gmail.com",
  address: "D13/B, Gokulam Main Rd, Vani Vilas Mohalla, Mysuru, Karnataka 570002",
  hours: "Everyday: 8:30 am to 11 pm",
};

export const ORDER_LINKS = {
  direct: "https://whiteteak.dotpe.in/catalog/499195/568418",
  zomato: "https://www.zomato.com/mysore/white-teak-coffee-roasters-gokulam",
  swiggy:
    "https://www.swiggy.com/restaurants/white-teak-coffee-roasters-gokulam-main-road-mysore-north-mysore-715606",
};

export const FOOD_GALLERY_IMAGES = [
  "/assets/food-gallery/food-1.jpg",
  "/assets/food-gallery/food-2.jpg",
  "/assets/food-gallery/food-3.jpg",
  "/assets/food-gallery/food-4.jpg",
  "/assets/food-gallery/food-5.jpg",
  "/assets/food-gallery/food-6.jpg",
];

export const NATURE_IMAGES = [
  "/assets/nature/nature-1.jpg",
  "/assets/nature/nature-2.jpg",
  "/assets/nature/nature-3.jpg",
];

export const FARM_IMAGES = [
  "/assets/farm/farm-1.jpg",
  "/assets/farm/farm-2.jpg",
  "/assets/farm/farm-3.jpg",
];

export const FEATURE_CARDS = [
  {
    subtitle: "From Farm to Your Cup",
    title: "Handpicked Specialty Coffee",
    image: "/assets/features/feature-1.jpg",
  },
  {
    subtitle: "Explore our curated collection of brewing equipment",
    title: "Brewing adventures",
    image: "/assets/features/feature-2.jpg",
  },
  {
    subtitle: "A Perfect Harmony with Our Coffee",
    title: "Freshly Baked Goodness",
    image: "/assets/features/feature-3.jpg",
  },
  {
    subtitle: "Immerse yourself in the tranquility of nature at our cafe",
    title: "Natural Oasis",
    image: null, // no image downloaded for this one — use a placeholder or farm image
  },
];
```

---

### 5.5 Navbar

**File:** `src/components/Navbar.tsx`
**Action:** REWRITE — simplified to match live site (logo image + brand text + 2 nav links)

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[color:var(--color-ivory)]/90 backdrop-blur-xl border-b border-[color:var(--color-line)]/60 shadow-sm"
          : "bg-[color:var(--color-ivory)]"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Brand */}
          <a href="#hero" className="flex items-center gap-3 group">
            <Image
              src="/assets/logo.png"
              alt="White Teak Logo"
              width={40}
              height={44}
              className="object-contain"
            />
            <span className="font-display text-sm md:text-base tracking-wide text-wt-coffee font-medium">
              WHITE TEAK COFFEE ROASTERS®️
            </span>
          </a>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-sans text-wt-brown-dark/80 hover:text-wt-coffee transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

### 5.6 HeroSection

**File:** `src/components/HeroSection.tsx`
**Action:** REWRITE — left text + right auto-play video, green gradient background

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MAPS_URL } from "@/lib/constants";

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".hero-sub", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(".hero-cta", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5,
      });
      gsap.from(".hero-video", {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.2,
      });
    },
    { scope: root }
  );

  return (
    <section
      id="hero"
      ref={root}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #e8f0d8 0%, #f0e8d0 50%, #f5efe6 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div>
            <h1 className="hero-title font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-wt-coffee">
              Where Coffee and Cuisine harmonize with beauty of nature
            </h1>
            <div className="hero-sub mt-6">
              <p className="font-sans text-base text-wt-brown-dark/80 leading-relaxed max-w-lg">
                Discover White Teak Coffe Roasters, a haven where the art of
                specialty coffee and the craft of delectable food unite weaving
                tapestry of an unforgettable
              </p>
              <p className="font-sans text-base text-wt-brown-dark/80 leading-relaxed mt-1">
                all-day cafe cafe experience
              </p>
            </div>
            <div className="hero-cta mt-8">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#2d5a27] text-white text-sm font-medium tracking-wide hover:bg-[#1e4019] transition-colors"
              >
                Explore Today
              </a>
            </div>
          </div>

          {/* Right — Video */}
          <div className="hero-video relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover aspect-[4/3]"
                poster="/assets/hero/video-thumb.jpg"
              >
                <source src="/assets/hero/hero-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### 5.7 FoodGallery *(NEW FILE)*

**File:** `src/components/FoodGallery.tsx`
**Action:** CREATE — horizontal scrolling food image gallery

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FOOD_GALLERY_IMAGES } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FoodGallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".food-head > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".food-head", start: "top 85%" },
      });
      gsap.from(".food-item", {
        x: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".food-scroll", start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="py-16 bg-[color:var(--color-ivory)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="food-head mb-8">
          <h2 className="font-display text-3xl md:text-4xl text-wt-coffee">
            Crafted Food and Drinks
          </h2>
          <p className="font-sans text-sm text-wt-brown-dark/70 mt-2">
            Each item on our menu is crafted with love and care
          </p>
        </div>
      </div>

      {/* Scrollable gallery */}
      <div className="food-scroll overflow-x-auto scroll-smooth-x fade-edges">
        <div className="flex gap-4 px-6 lg:px-12 pb-4">
          {FOOD_GALLERY_IMAGES.map((src, i) => (
            <div
              key={i}
              className="food-item shrink-0 w-64 md:w-80 aspect-[3/4] rounded-xl overflow-hidden"
            >
              <Image
                src={src}
                alt={`Crafted food and drink ${i + 1}`}
                width={320}
                height={427}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 5.8 CategoryLinks *(NEW FILE)*

**File:** `src/components/CategoryLinks.tsx`
**Action:** CREATE — 5 round category icons linking to online menu

```tsx
"use client";

import Image from "next/image";
import { CATEGORY_LINKS, MENU_URL } from "@/lib/constants";

export default function CategoryLinks() {
  return (
    <section className="py-12 bg-[color:var(--color-ivory)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {CATEGORY_LINKS.map((cat) => (
            <a
              key={cat.name}
              href={MENU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[color:var(--color-line)] group-hover:border-[color:var(--color-brass)] transition-colors shadow-md">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="font-sans text-sm text-wt-coffee font-medium tracking-wide">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 5.9 NatureSection *(NEW FILE)*

**File:** `src/components/NatureSection.tsx`
**Action:** CREATE — "Nature's Embrace" heading + 3-image carousel

```tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { NATURE_IMAGES } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function NatureSection() {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      gsap.from(".nature-head > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".nature-head", start: "top 85%" },
      });
      gsap.from(".nature-gallery", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".nature-gallery", start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="py-20 bg-[color:var(--color-ivory)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="nature-head text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-wt-coffee">
            Nature&apos;s Embrace
          </h2>
          <p className="font-sans text-sm text-wt-brown-dark/70 mt-3 max-w-xl mx-auto">
            Escape to Serenity: A Dining Experience Enveloped in Nature&apos;s Warmth
          </p>
        </div>

        {/* Image carousel */}
        <div className="nature-gallery relative">
          <div className="aspect-[16/9] md:aspect-[2.5/1] rounded-2xl overflow-hidden">
            {NATURE_IMAGES.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Nature's Embrace ${i + 1}`}
                fill
                className={`object-cover transition-opacity duration-700 ${
                  i === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Carousel dots */}
          <div className="flex justify-center gap-3 mt-6">
            {NATURE_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeIndex
                    ? "bg-wt-coffee scale-110"
                    : "bg-wt-brown-dark/30 hover:bg-wt-brown-dark/50"
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### 5.10 StorySection

**File:** `src/components/StorySection.tsx`
**Action:** REWRITE — "Our Story" with all subsections matching live site

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const storySections = [
  {
    title: "The Coffee",
    paragraphs: [
      'Along with being our founding-planter, we have chosen to work in direct trade relationships at origin with coffee estates and smallholder farmers harvesting and processing coffees that we aim to curate into only SCA 85+ point scoring coffees.',
      'We pride with our intentional introduction of White Teak "Cascara" (coffee cherry tea) which is the dried skin of coffee cherries which you can brew as you would any other specialty tea.',
    ],
  },
  {
    title: "The Teas",
    paragraphs: [
      "We source teas direct from farmers and craft them into unique blends. We take pride in our sourcing. Our teas are crafted in small batches - We never compromise on freshness. We never choose flavors over health - 100% natural ingredients always.",
    ],
  },
  {
    title: "The Bakes",
    paragraphs: [
      "We source teas direct from farmers and craft them into unique blends. We take pride in our sourcing. Our teas are crafted in small batches - We never compromise on freshness. We never choose flavors over health - 100% natural ingredients always.",
    ],
  },
  {
    title: "Home Brewing Experiences",
    paragraphs: [
      "A curated collection of brewing equipment's, ideal for coffee enthusiasts and novices alike.",
    ],
  },
  {
    title: "Events & Experiences",
    paragraphs: [
      "The White Teak Ambience strives to showcase the Indian subcontinent at its peak for specialty coffee, craft bakes and innovative design. We bring together communities across the various walks of life, through specially curated events and experiences.",
      '"We feel that an organic and natural extension of our philosophy to help spur an ecosystem to pair such deliciousness with other indigenous talent of the subcontinent that we feel strongly have not yet gotten their fair due: visual artists, designers, musicians, and social changemakers. We\'re humbled by the sheer number of these folks producing world-class work in our region."',
    ],
  },
];

export default function StorySection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".story-intro > *", {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".story-intro", start: "top 80%" },
      });
      gsap.from(".story-block", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".story-blocks", start: "top 75%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      id="story"
      ref={root}
      className="py-24 bg-[color:var(--color-ivory)]"
    >
      <div className="max-w-[900px] mx-auto px-6 lg:px-12">
        {/* Intro */}
        <div className="story-intro mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-wt-coffee mb-4">
            Our Story
          </h2>
          <p className="font-sans text-base text-wt-brown-dark/80 leading-relaxed italic">
            &ldquo;Filtered with Love&rdquo; : being the foundation for our
            All-day Cafe born out of a mutual love for specialty coffee and craft
            food.
          </p>
        </div>

        {/* Story blocks */}
        <div className="story-blocks space-y-12">
          {storySections.map((section) => (
            <div key={section.title} className="story-block">
              <h3 className="font-display text-xl md:text-2xl text-wt-coffee mb-3 font-semibold">
                {section.title}
              </h3>
              {section.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="font-sans text-sm md:text-base text-wt-brown-dark/75 leading-relaxed mb-3"
                >
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Closing quote */}
        <p className="mt-16 font-sans text-base text-wt-brown-dark/80 leading-relaxed italic border-l-2 border-[color:var(--color-brass)] pl-6">
          &ldquo;Brewing Experiences&rdquo; : The Food, Coffee, Teas and
          Ambience make for a great experience. White Teak will inspire you, on
          every occasion.
        </p>
      </div>
    </section>
  );
}
```

---

### 5.11 FarmSection *(NEW FILE)*

**File:** `src/components/FarmSection.tsx`
**Action:** CREATE — "From Heart to Hands, Farm to Cup" heading + carousel

```tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FARM_IMAGES } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FarmSection() {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      gsap.from(".farm-head > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".farm-head", start: "top 85%" },
      });
      gsap.from(".farm-gallery", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".farm-gallery", start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="py-20 bg-[color:var(--color-ivory)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="farm-head text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-wt-coffee">
            From Heart to Hands, Farm to Cup
          </h2>
          <p className="font-sans text-sm text-wt-brown-dark/70 mt-3 max-w-xl mx-auto">
            Our Coffee Farms Nestled in Nature&apos;s Embrace
          </p>
        </div>

        {/* Image carousel */}
        <div className="farm-gallery relative">
          <div className="aspect-[16/9] md:aspect-[2.5/1] rounded-2xl overflow-hidden">
            {FARM_IMAGES.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Coffee farm ${i + 1}`}
                fill
                className={`object-cover transition-opacity duration-700 ${
                  i === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Carousel dots */}
          <div className="flex justify-center gap-3 mt-6">
            {FARM_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeIndex
                    ? "bg-wt-coffee scale-110"
                    : "bg-wt-brown-dark/30 hover:bg-wt-brown-dark/50"
                }`}
                aria-label={`View farm image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### 5.12 FeatureCards *(NEW FILE)*

**File:** `src/components/FeatureCards.tsx`
**Action:** CREATE — 4 feature cards at bottom (before footer)

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FEATURE_CARDS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeatureCards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".feat-card", {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".feat-grid", start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="py-20 bg-[color:var(--color-ivory)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="feat-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="feat-card group rounded-2xl overflow-hidden bg-[color:var(--color-parchment)] hover:shadow-xl transition-shadow duration-500"
            >
              {/* Image */}
              <div className="aspect-[16/9] relative overflow-hidden bg-wt-brown/10">
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-lg text-wt-coffee/40">
                      {card.title}
                    </span>
                  </div>
                )}
              </div>
              {/* Text */}
              <div className="p-5">
                <p className="font-sans text-xs text-wt-brown-dark/60 mb-1.5">
                  {card.subtitle}
                </p>
                <h3 className="font-display text-lg text-wt-coffee leading-tight">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 5.13 Footer

**File:** `src/components/Footer.tsx`
**Action:** REWRITE — match live site footer layout exactly

```tsx
import Image from "next/image";
import { SOCIAL_LINKS, CONTACT, ORDER_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-[color:var(--color-line)]/70 bg-[color:var(--color-parchment)]/30"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 — Social + Order badges */}
          <div>
            {/* Social Bar */}
            <div className="flex gap-4 mb-6">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-wt-coffee/20 flex items-center justify-center text-xs font-sans text-wt-coffee hover:bg-wt-coffee hover:text-wt-cream transition-colors"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-wt-coffee/20 flex items-center justify-center text-xs font-sans text-wt-coffee hover:bg-wt-coffee hover:text-wt-cream transition-colors"
                aria-label="Facebook"
              >
                FB
              </a>
            </div>
            <p className="font-sans text-sm text-wt-brown-dark/70 mb-1">
              Order Now
            </p>
            <p className="font-sans text-sm text-wt-brown-dark/60">Swiggy</p>
            <p className="font-sans text-sm text-wt-brown-dark/60">Zomato</p>
          </div>

          {/* Column 2 — Find your way here */}
          <div>
            <h4 className="font-sans text-sm font-semibold text-wt-coffee mb-4">
              Find your way here
            </h4>
            <p className="font-sans text-sm text-wt-brown-dark/70">
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-wt-coffee transition-colors"
              >
                Everyday:
              </a>
            </p>
            <p className="font-sans text-sm text-wt-brown-dark/70 mb-3">
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-wt-coffee transition-colors"
              >
                8:30 am to 11 pm
              </a>
            </p>
            <p className="font-sans text-sm text-wt-brown-dark/60 leading-relaxed">
              {CONTACT.address}
            </p>
          </div>

          {/* Column 3 — Contact Us */}
          <div>
            <h4 className="font-sans text-sm font-semibold text-wt-coffee mb-4">
              Contact Us
            </h4>
            <p className="font-sans text-sm text-wt-brown-dark/70">
              Whatsapp:
            </p>
            <p className="font-sans text-sm text-wt-brown-dark/70 mb-3">
              {CONTACT.whatsapp}
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="font-sans text-sm text-wt-brown-dark/70 hover:text-wt-coffee transition-colors"
            >
              {CONTACT.email}
            </a>
          </div>

          {/* Column 4 — Order Now */}
          <div>
            <h4 className="font-sans text-sm font-semibold text-wt-coffee mb-4">
              Order Now
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={ORDER_LINKS.direct}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-wt-brown-dark/70 hover:text-wt-coffee transition-colors"
                >
                  Direct
                </a>
              </li>
              <li>
                <a
                  href={ORDER_LINKS.zomato}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-wt-brown-dark/70 hover:text-wt-coffee transition-colors"
                >
                  Zomato
                </a>
              </li>
              <li>
                <a
                  href={ORDER_LINKS.swiggy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-wt-brown-dark/70 hover:text-wt-coffee transition-colors"
                >
                  Swiggy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[color:var(--color-line)]/70">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6">
          <p className="font-sans text-xs text-wt-brown-dark/50 text-center mb-4">
            &copy;Copyright 2024. White Teak Coffee Roasters. All Rights Reserved.
          </p>
          <p className="font-display text-2xl md:text-4xl text-center text-wt-coffee tracking-wide">
            WHITE TEAK COFFEE ROASTERS&reg;️
          </p>
        </div>
      </div>
    </footer>
  );
}
```

---

## 6. Next.js Config

**File:** `next.config.ts`
**Action:** Ensure remote images are allowed (for any future external images)

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
};

export default nextConfig;
```

---

## 7. Summary of All File Operations

| Action | File |
|--------|------|
| MODIFY | `src/app/layout.tsx` — update metadata |
| REWRITE | `src/app/page.tsx` — new section order |
| APPEND | `src/app/globals.css` — add 2 utility classes |
| REWRITE | `src/lib/constants.ts` — all data centralized |
| REWRITE | `src/components/Navbar.tsx` — simplified, logo image |
| REWRITE | `src/components/HeroSection.tsx` — text left, video right |
| CREATE | `src/components/FoodGallery.tsx` — horizontal scroll gallery |
| CREATE | `src/components/CategoryLinks.tsx` — 5 round icons |
| CREATE | `src/components/NatureSection.tsx` — image carousel |
| REWRITE | `src/components/StorySection.tsx` — all story text |
| CREATE | `src/components/FarmSection.tsx` — farm carousel |
| CREATE | `src/components/FeatureCards.tsx` — 4 feature cards |
| REWRITE | `src/components/Footer.tsx` — 4-column footer |
| MODIFY | `next.config.ts` — add image domains |
| DELETE | `src/components/BeanMorph.tsx` |
| DELETE | `src/components/FloatingParticles.tsx` |
| DELETE | `src/components/Marquee.tsx` |
| DELETE | `src/components/NewsletterSection.tsx` |
| DELETE | `src/components/ScrollGradientBackground.tsx` |
| DELETE | `src/components/ScrollTrack/` (directory) |
| DELETE | `src/components/TestimonialsSection.tsx` |
| DELETE | `src/components/SocialSection.tsx` |
| DELETE | `src/components/GallerySection.tsx` |
| DELETE | `src/components/CatalogSection.tsx` |

---

## 8. Downloaded Assets Checklist

All of these should already exist in `public/assets/`:

```
public/assets/
├── logo.png
├── hero/
│   ├── hero-video.mp4
│   └── video-thumb.jpg
├── food-gallery/
│   ├── food-1.jpg
│   ├── food-2.jpg
│   ├── food-3.jpg
│   ├── food-4.jpg
│   ├── food-5.jpg
│   └── food-6.jpg
├── categories/
│   ├── coffee.jpg
│   ├── breakfast.jpg
│   ├── desserts.jpg
│   ├── savoury.jpg
│   └── beverages.jpg
├── nature/
│   ├── nature-1.jpg
│   ├── nature-2.jpg
│   └── nature-3.jpg
├── farm/
│   ├── farm-1.jpg
│   ├── farm-2.jpg
│   └── farm-3.jpg
└── features/
    ├── feature-1.jpg
    ├── feature-2.jpg
    └── feature-3.jpg
```

---

## 9. How to Apply This Blueprint

1. **Copy each code block** from Section 5 into the corresponding file
2. **Delete the files** listed in the DELETE table in Section 7
3. **Append the CSS** from Section 5.3 to the bottom of `globals.css`
4. **Verify assets** exist per Section 8 checklist
5. Run `npm run dev` and check all sections render correctly
6. Fine-tune spacing, colors, and animations to taste

---

*This blueprint was generated by scraping the live site at https://www.whiteteakroasters.com/ on 2026-04-21 using Playwright MCP. All textual content has been preserved verbatim.*
