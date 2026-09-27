import { NextRequest, NextResponse } from "next/server";

// In-memory cache for fast repeated responses
const imageCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shortcode = searchParams.get("shortcode") || searchParams.get("code");
    const rawUrl = searchParams.get("url");

    let code = shortcode;
    if (!code && rawUrl) {
      const match = rawUrl.match(/instagram\.com\/(?:reel|p|tv)\/([^/?#&]+)/i);
      code = match ? match[1] : null;
    }

    if (!code) {
      return new NextResponse("Missing shortcode or url parameter", { status: 400 });
    }

    // Check in-memory cache
    const cached = imageCache.get(code);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return new NextResponse(new Uint8Array(cached.buffer), {
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    // 1. Scrape the og:image from Instagram Reel page
    const reelUrl = `https://www.instagram.com/reel/${code}/`;
    const ogRes = await fetch(reelUrl, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 },
    });

    let imageUrl: string | null = null;
    if (ogRes.ok) {
      const html = await ogRes.text();
      const match =
        html.match(/<meta property="og:image" content="([^"]+)"/i) ||
        html.match(/property="og:image" content="([^"]+)"/i);
      if (match && match[1]) {
        imageUrl = match[1].replace(/&amp;/g, "&");
      }
    }

    // Fallback: Embed page
    if (!imageUrl) {
      const embedUrl = `https://www.instagram.com/p/${code}/embed/captioned/`;
      const embedRes = await fetch(embedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      if (embedRes.ok) {
        const html = await embedRes.text();
        const match =
          html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/i) ||
          html.match(/src="([^"]+)"[^>]*class="EmbeddedMediaImage"/i) ||
          html.match(/<img[^>]+src="([^"]+scontent[^"]+)"/i);
        if (match && match[1]) {
          imageUrl = match[1].replace(/&amp;/g, "&");
        }
      }
    }

    if (!imageUrl) {
      // Return a redirect to default food image if extraction failed
      return NextResponse.redirect(new URL("/assets/food-gallery/dish-1.webp", request.url));
    }

    // 2. Fetch the image bytes from Instagram CDN
    const imgRes = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!imgRes.ok) {
      return NextResponse.redirect(new URL("/assets/food-gallery/dish-1.webp", request.url));
    }

    const contentType = imgRes.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Store in cache
    imageCache.set(code, {
      buffer,
      contentType,
      timestamp: Date.now(),
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Error in instagram-cover route:", error);
    return NextResponse.redirect(new URL("/assets/food-gallery/dish-1.webp", request.url));
  }
}
