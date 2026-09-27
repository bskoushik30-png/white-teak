"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { subscribeNewsletter } from "@/app/actions/newsletter";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function NewsletterSection() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".nl-item",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.11,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
        }
      );
    },
    { scope: root }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    try {
      await subscribeNewsletter(email);
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setEmail("");
      setTimeout(() => {
        gsap.fromTo(
          ".nl-success",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
        );
      }, 50);
    }
  };

  return (
    <section
      ref={root}
      id="newsletter"
      style={{ background: "transparent" }}
      className="px-6 py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[720px]">
        {/* Card */}
        <div
          className="relative overflow-hidden rounded-xl px-8 py-12 text-center md:px-14 md:py-14"
          style={{
            background: "var(--color-ivory)",
            boxShadow: "0 40px 80px -20px rgba(11,7,4,0.55)",
          }}
        >
          {/* Subtle corner marks */}
          <span aria-hidden className="absolute top-6 left-6 block h-8 w-px bg-[color:var(--color-espresso)]/10" />
          <span aria-hidden className="absolute top-6 left-6 block h-px w-8 bg-[color:var(--color-espresso)]/10" />
          <span aria-hidden className="absolute top-6 right-6 block h-8 w-px bg-[color:var(--color-espresso)]/10" />
          <span aria-hidden className="absolute top-6 right-6 block h-px w-8 bg-[color:var(--color-espresso)]/10" />
          <span aria-hidden className="absolute bottom-6 left-6 block h-8 w-px bg-[color:var(--color-espresso)]/10" />
          <span aria-hidden className="absolute bottom-6 left-6 block h-px w-8 bg-[color:var(--color-espresso)]/10" />
          <span aria-hidden className="absolute bottom-6 right-6 block h-8 w-px bg-[color:var(--color-espresso)]/10" />
          <span aria-hidden className="absolute bottom-6 right-6 block h-px w-8 bg-[color:var(--color-espresso)]/10" />

          <div className="mx-auto max-w-[560px]">
            {/* Eyebrow */}
            <div className="nl-item mb-8 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-[color:var(--color-espresso)]/20" />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.38em] text-[color:var(--color-espresso)]/45">
                Newsletter
              </span>
              <div className="h-px w-8 bg-[color:var(--color-espresso)]/20" />
            </div>

            {/* Heading */}
            <h2 className="nl-item font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.0] tracking-[-0.025em] text-[color:var(--color-espresso)] mb-5">
              Letters from<br />
              the roastery
            </h2>

            {/* Subline */}
            <p className="nl-item font-sans text-[14px] leading-[1.8] text-[color:var(--color-espresso)] mb-12 max-w-[38ch] mx-auto">
              Seasonal menus, brewing guides, and the occasional quiet story —
              sent rarely, written carefully.
            </p>

            {/* Form / Success */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="nl-item mx-auto max-w-[400px]">
                <div
                  className="flex items-center transition-all duration-400 rounded-full"
                  style={{
                    border: focused
                      ? "1px solid var(--color-espresso)"
                      : "1px solid rgba(27,16,10,0.18)",
                    boxShadow: focused
                      ? "0 0 0 3px rgba(27,16,10,0.06)"
                      : "none",
                  }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent pl-5 pr-2 py-3.5 font-sans text-[13px] text-[color:var(--color-espresso)] placeholder:text-[color:var(--color-espresso)]/30 outline-none"
                  />
                  <button
                    type="submit"
                    className="m-1 rounded-full bg-[color:var(--color-espresso)] px-6 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] font-medium text-[color:var(--color-ivory)] transition-opacity duration-300 hover:opacity-70"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            ) : (
              <div className="nl-success opacity-0">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-espresso)]/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[color:var(--color-espresso)]">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="font-display text-[1.6rem] text-[color:var(--color-espresso)] mb-1">
                  You&apos;re on the list.
                </p>
                <p className="font-sans text-[12px] text-[color:var(--color-espresso)]/40">
                  Something worth reading will find you soon.
                </p>
              </div>
            )}

            {/* Footnote */}
            {!submitted && (
              <p className="nl-item mt-8 font-sans text-[9px] uppercase tracking-[0.35em] text-[color:var(--color-espresso)]">
                No spam · Unsubscribe anytime.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
