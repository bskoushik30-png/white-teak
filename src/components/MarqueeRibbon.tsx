"use client";

type Props = {
  items?: string[];
  variant?: "dark" | "brass" | "light";
  speed?: "slow" | "normal";
  reverse?: boolean;
};

const DEFAULT_ITEMS = [
  "Specialty Coffee",
  "Craft Bakes",
  "Direct Trade",
  "Seasonal Menu",
  "All-day Café",
  "Single Origin",
];

export default function MarqueeRibbon({
  items = DEFAULT_ITEMS,
  variant = "dark",
  speed = "normal",
  reverse = false,
}: Props) {
  const stream = [...items, ...items, ...items];

  const base =
    variant === "dark"
      ? "bg-[color:var(--color-espresso)] text-[color:var(--color-ivory)]"
      : variant === "brass"
      ? "bg-[color:var(--color-brass)] text-[color:var(--color-espresso)]"
      : "bg-[color:var(--color-linen)] text-[color:var(--color-espresso)] border-y border-[color:var(--color-line)]/60";

  const anim = reverse
    ? "animate-marquee-reverse"
    : speed === "slow"
    ? "animate-marquee-slow"
    : "animate-marquee";

  return (
    <div className={`${base} overflow-hidden py-5 select-none`}>
      <div className={`flex whitespace-nowrap ${anim}`}>
        {stream.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 px-8 font-display text-2xl md:text-4xl tracking-tight"
          >
            {item}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="opacity-60"
              aria-hidden="true"
            >
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
