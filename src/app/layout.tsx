import type { Metadata } from "next";
import { Libre_Baskerville, Raleway, Cinzel } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "White Teak Coffee Roasters — Brewed with Love, Poured with Soul",
  description:
    "Brewing coffee, Brewing Experiences. Specialty coffee, thoughtful food and spaces designed for slow moments in Mysuru.",
  icons: {
    icon: [
      { url: "/icon.png?v=20261002", type: "image/png" },
      { url: "/white-teak-emblem.png?v=20261002", type: "image/png" },
      { url: "/favicon.ico?v=20261002" },
    ],
    shortcut: "/icon.png?v=20261002",
    apple: "/apple-icon.png?v=20261002",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${raleway.variable} ${cinzel.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/icon.png?v=20261002" type="image/png" />
        <link rel="shortcut icon" href="/icon.png?v=20261002" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=20261002" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
