"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GOOGLE_REVIEWS = [
  {
    name: "Jashwanth H.",
    text: "Warm ambience creates the ideal relaxation spot. Cheesecake and Pasta are top-notch!",
  },
  {
    name: "Abhijit P.",
    text: "An absolute gem for ambience and cuisine. Blueberry Cheesecake Waffle is a standout.",
  },
  {
    name: "Arpitha S.",
    text: "Really nice vibe, especially the evening terrace. Americano is a must-try!",
  },
  {
    name: "Ballanda K.",
    text: "Absolute delight for ambience seekers. Soft lighting and natural wood accents — cozy comfort.",
  },
  {
    name: "Navneeth G M.",
    text: "Spacious café with plenty of seating. Turkish eggs and shakshuka were excellent!",
  },
  {
    name: "Srinivas S.",
    text: "A lovely outdoor place for breakfast and brunch. Spacious seating and generous portions.",
  },
  {
    name: "Shashikala T.",
    text: "Good food, great coffee and beautiful ambience. Will definitely visit again!",
  },
  {
    name: "Abhishek J R.",
    text: "Crispy bacon, runny eggs, golden toast — English breakfast done right. Serene atmosphere.",
  },
  {
    name: "RolfMaria K.",
    text: "Charming little spot with a beautiful courtyard. Apple pie and cappuccino were excellent.",
  },
  {
    name: "Sridevi R.",
    text: "Coffee is rich and full of flavour. The Zoodles are a must-try!",
  },
  {
    name: "Kusuma E.",
    text: "A beautiful place to spend time with family or friends. Irish coffee is a highlight!",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-[#FBBC04]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function ReviewCard({ review }: { review: (typeof GOOGLE_REVIEWS)[0] }) {
  return (
    <div className="review-card shrink-0 w-[340px] md:w-[380px] rounded-2xl bg-[#FBF7F0] border border-[color:var(--color-line)]/40 p-7 flex flex-col gap-4 select-none">
      {/* Quote icon */}
      <svg className="w-8 h-8 text-[color:var(--color-brass)]/40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
      </svg>

      {/* Review text */}
      <p className="font-sans text-[15px] leading-relaxed text-[color:var(--color-walnut)] whitespace-normal">
        {review.text}
      </p>

      {/* Divider */}
      <div className="h-px bg-[color:var(--color-line)]/50 mt-auto" />

      {/* Footer: avatar + name + stars + google */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[color:var(--color-parchment)] border border-[color:var(--color-line)] flex items-center justify-center shrink-0">
          <span className="font-display text-sm font-semibold text-[color:var(--color-walnut)]">
            {review.name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-sm font-medium text-[color:var(--color-espresso)]">
            {review.name}
          </span>
          <Stars />
        </div>
        <div className="ml-auto">
          <GoogleIcon />
        </div>
      </div>
    </div>
  );
}

export default function GoogleReviews() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".testimonials-header > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: { trigger: ".testimonials-header", start: "top 85%" },
      });

      gsap.from(".review-card", {
        y: 28,
        opacity: 0,
        stagger: 0.05,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: track.current, start: "top 88%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      id="testimonials"
      ref={root}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Header */}
      <div className="testimonials-header text-center mb-14 px-6">
        <span className="eyebrow-brass mb-3 block">Testimonials</span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[color:var(--color-ivory)] leading-tight mt-2">
          Loved by{" "}
          <span className="text-[color:var(--color-brass)]">2,400+</span> Guests
        </h2>
        <div className="flex items-center justify-center gap-2.5 mt-5">
          <GoogleIcon className="w-6 h-6" />
          <span className="font-display text-2xl font-semibold text-[color:var(--color-ivory)]">
            4.8
          </span>
          <Stars />
          <span className="text-sm text-[color:var(--color-ivory)]/50">
            on Google
          </span>
        </div>
      </div>

      {/* Infinite marquee of review cards */}
      <div className="overflow-hidden py-2 relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[var(--color-ink)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[var(--color-ink)] to-transparent" />

        <div
          ref={track}
          className="flex w-max gap-6 hover:[animation-play-state:paused] [&>*]:[animation-play-state:inherit]"
          style={{
            animation: "marquee-reviews 60s linear infinite",
          }}
        >
          {/* First set */}
          {GOOGLE_REVIEWS.map((review, i) => (
            <ReviewCard key={`a-${i}`} review={review} />
          ))}
          {/* Duplicate set for seamless loop */}
          {GOOGLE_REVIEWS.map((review, i) => (
            <ReviewCard key={`b-${i}`} review={review} />
          ))}
        </div>
      </div>


      {/* CTA */}
      <div className="text-center mt-14 px-6 relative z-20">
        <a
          href="https://www.google.com/maps/place/White+Teak+Coffee+Roasters/@12.3282387,76.6285332,17z/data=!4m8!3m7!1s0x3baf7b6d8a3f990f:0xab0db788a2ac2962!8m2!3d12.3282387!4d76.6285332!9m1!1b1!16s%2Fg%2F11t7c0t7yl"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill btn-pill-white text-sm"
        >
          Read All Reviews on Google
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
