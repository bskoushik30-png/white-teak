import type { Metadata } from "next";
import { Libre_Baskerville, Raleway, Cinzel } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "White Teak Coffee Roasters — Brewed with Love, Poured with Soul",
  description:
    "Brewing coffee, Brewing Experiences. Specialty coffee, thoughtful food and spaces designed for slow moments in Mysuru.",
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
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
