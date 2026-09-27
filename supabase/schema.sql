-- =========================================================
-- WHITE TEAK COFFEE ROASTERS - FULL DATABASE SCHEMA
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- =========================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SECTION MEDIA TABLE (All website photos, banners, and cards)
CREATE TABLE IF NOT EXISTS public.section_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT NOT NULL, 
    item_key TEXT NOT NULL,    
    title TEXT,                
    subtitle TEXT,             
    image_url TEXT NOT NULL,   
    alt_text TEXT,
    display_order INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(section_key, item_key)
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    hours TEXT NOT NULL,
    map_url TEXT NOT NULL,
    image_url TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.section_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Section Media Policies (Public Read + Public Insert/Update for Admin)
CREATE POLICY "Allow public read access on section_media" 
ON public.section_media FOR SELECT USING (true);

CREATE POLICY "Allow public insert on section_media" 
ON public.section_media FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on section_media" 
ON public.section_media FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on section_media" 
ON public.section_media FOR DELETE USING (true);

-- Categories Policies
CREATE POLICY "Allow public read access on categories" 
ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on categories" 
ON public.categories FOR ALL USING (true);

-- Locations Policies
CREATE POLICY "Allow public read access on locations" 
ON public.locations FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on locations" 
ON public.locations FOR ALL USING (true);

-- Contact Inquiries Policy
CREATE POLICY "Allow public insert on contact_inquiries" 
ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on contact_inquiries" 
ON public.contact_inquiries FOR SELECT USING (true);

-- Newsletter Subscribers Policy
CREATE POLICY "Allow public insert on newsletter_subscribers" 
ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on newsletter_subscribers" 
ON public.newsletter_subscribers FOR SELECT USING (true);

-- =========================================================
-- SUPABASE STORAGE BUCKET (site-images)
-- =========================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Allow public read on site-images bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "Allow public upload to site-images bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Allow public update on site-images bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-images');

CREATE POLICY "Allow public delete on site-images bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-images');

-- =========================================================
-- SEED INITIAL DATA FOR ALL SECTIONS
-- =========================================================

-- 1. HERO SECTION
INSERT INTO public.section_media (section_key, item_key, title, subtitle, image_url, display_order)
VALUES
    ('hero', 'hero_bg', 'Hero Background', 'Brewing coffee, Brewing Experiences', '/assets/hero/hero-bg.webp', 1)
ON CONFLICT (section_key, item_key) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 2. NEW ARRIVALS (The Summer Affair)
INSERT INTO public.section_media (section_key, item_key, title, subtitle, image_url, display_order)
VALUES
    ('arrivals', 'arrivals_dishes', 'Mango Dish Collection', 'The Summer Affair featured seasonal collection', '/mango-dishes.png', 1),
    ('arrivals', 'arrivals_title', 'The Summer Affair Title', 'Hand-lettered seasonal headline artwork', '/summer-affair-title-cropped.png', 2),
    ('arrivals', 'arrivals_branch', 'Mango Branch Decoration', 'Top-right botanical ambience illustration', '/mango-branch.png', 3)
ON CONFLICT (section_key, item_key) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 2. FOOD GALLERY (10 Dishes)
INSERT INTO public.section_media (section_key, item_key, title, subtitle, image_url, display_order)
VALUES
    ('food_gallery', 'dish_1', 'Specialty Dish 1', 'Craft Kitchen', '/assets/food-gallery/dish-1.webp', 1),
    ('food_gallery', 'dish_2', 'Specialty Dish 2', 'Craft Kitchen', '/assets/food-gallery/dish-2.webp', 2),
    ('food_gallery', 'dish_3', 'Specialty Dish 3', 'Craft Kitchen', '/assets/food-gallery/dish-3.webp', 3),
    ('food_gallery', 'dish_4', 'Specialty Dish 4', 'Craft Kitchen', '/assets/food-gallery/dish-4.webp', 4),
    ('food_gallery', 'dish_5', 'Specialty Dish 5', 'Craft Kitchen', '/assets/food-gallery/dish-5.webp', 5),
    ('food_gallery', 'dish_6', 'Specialty Dish 6', 'Craft Kitchen', '/assets/food-gallery/dish-6.webp', 6),
    ('food_gallery', 'dish_7', 'Specialty Dish 7', 'Craft Kitchen', '/assets/food-gallery/dish-7.webp', 7),
    ('food_gallery', 'dish_8', 'Specialty Dish 8', 'Craft Kitchen', '/assets/food-gallery/dish-8.webp', 8),
    ('food_gallery', 'dish_9', 'Specialty Dish 9', 'Craft Kitchen', '/assets/food-gallery/dish-9.webp', 9),
    ('food_gallery', 'dish_10', 'Specialty Dish 10', 'Craft Kitchen', '/assets/food-gallery/dish-10.webp', 10)
ON CONFLICT (section_key, item_key) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 3. NATURE & AMBIENCE (6 Images)
INSERT INTO public.section_media (section_key, item_key, title, subtitle, image_url, display_order)
VALUES
    ('nature', 'ambience_1', 'Cafe Ambience 1', 'Natural Oasis', '/assets/ambience/ambience-1.webp', 1),
    ('nature', 'ambience_2', 'Cafe Ambience 2', 'Natural Oasis', '/assets/ambience/ambience-2.webp', 2),
    ('nature', 'ambience_3', 'Cafe Ambience 3', 'Natural Oasis', '/assets/ambience/ambience-3.webp', 3),
    ('nature', 'ambience_4', 'Cafe Ambience 4', 'Natural Oasis', '/assets/ambience/ambience-4.webp', 4),
    ('nature', 'ambience_5', 'Cafe Ambience 5', 'Natural Oasis', '/assets/ambience/ambience-5.webp', 5),
    ('nature', 'ambience_6', 'Cafe Ambience 6', 'Natural Oasis', '/assets/ambience/ambience-6.webp', 6)
ON CONFLICT (section_key, item_key) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 4. STORY SECTION (5 Story Blocks)
INSERT INTO public.section_media (section_key, item_key, title, subtitle, image_url, display_order)
VALUES
    ('story', 'story_coffee', 'The Coffee', 'SCA 85+ single origins and White Teak Cascara', '/scroll track/ChatGPT_Image_Apr_29__2026__03_03_11_PM-removebg-preview.png', 1),
    ('story', 'story_teas', 'The Teas', 'Direct-from-farm single origins and craft blends', '/scroll track/ChatGPT_Image_Apr_29__2026__03_08_59_PM-removebg-preview.png', 2),
    ('story', 'story_bakes', 'The Bakes', 'In-house craft kitchen comfort food', '/scroll track/ChatGPT_Image_Apr_29__2026__03_08_45_PM-removebg-preview.png', 3),
    ('story', 'story_home_brewing', 'Home Brewing', 'Curated brewing equipment and slow rituals', '/scroll track/ChatGPT_Image_Apr_29__2026__03_11_42_PM-removebg-preview.png', 4),
    ('story', 'story_events', 'Events', 'Shared spaces for artists, makers, and conversations', '/scroll track/ChatGPT_Image_Apr_29__2026__03_26_30_PM-removebg-preview.png', 5)
ON CONFLICT (section_key, item_key) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 5. FARM & ORIGIN (3 Images)
INSERT INTO public.section_media (section_key, item_key, title, subtitle, image_url, display_order)
VALUES
    ('farm', 'plantation_1', 'Estate Origin 1', 'From our founding estate', '/assets/farm/plantation1.webp', 1),
    ('farm', 'plantation_2', 'Estate Origin 2', 'Sustainable farming & harvesting', '/assets/farm/plantation2.webp', 2),
    ('farm', 'plantation_3', 'Estate Origin 3', 'Origin to cup transparency', '/assets/farm/plantation3.webp', 3)
ON CONFLICT (section_key, item_key) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 6. FEATURE CARDS (4 Cards)
INSERT INTO public.section_media (section_key, item_key, title, subtitle, image_url, display_order)
VALUES
    ('feature_cards', 'feat_1', 'Handpicked Specialty Coffee', 'From Farm to Your Cup', '/assets/farm/cropped/handpicked-specialty-card-opt.webp', 1),
    ('feature_cards', 'feat_2', 'Brewing adventures', 'Explore our curated collection of brewing equipment', '/assets/newmoreimages/latte-glass-opt.webp', 2),
    ('feature_cards', 'feat_3', 'Freshly Baked Goodness', 'A Perfect Harmony with Our Coffee', '/assets/newmoreimages/lotus-cheesecake-opt.webp', 3),
    ('feature_cards', 'feat_4', 'Natural Oasis', 'Immerse yourself in the tranquillity of nature at our café.', '/assets/newmoreimages/cafe-exterior-opt.webp', 4)
ON CONFLICT (section_key, item_key) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 7. CATEGORIES (5 Categories)
INSERT INTO public.section_media (section_key, item_key, title, subtitle, image_url, display_order)
VALUES
    ('categories', 'cat_coffee', 'Coffee', 'Single origin pours', '/assets/categories/coffee.webp', 1),
    ('categories', 'cat_breakfast', 'Breakfast', 'Slow mornings', '/assets/categories/breakfast.webp', 2),
    ('categories', 'cat_desserts', 'Desserts', 'Sweet finishes', '/assets/categories/desserts.webp', 3),
    ('categories', 'cat_savoury', 'Savoury', 'Hearty plates', '/assets/categories/savoury.webp', 4),
    ('categories', 'cat_beverages', 'Beverages', 'Crafted sips', '/assets/categories/beverages.webp', 5)
ON CONFLICT (section_key, item_key) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 8. LOCATIONS (4 Branches)
INSERT INTO public.section_media (section_key, item_key, title, subtitle, image_url, display_order)
VALUES
    ('locations', 'loc_gokulam', 'Gokulam', '7 AM – 11 PM', '/locations/wtcr_gokulam.webp', 1),
    ('locations', 'loc_kavi_mane', 'Kavi Mane', '11 AM – 9 PM', '/locations/kavi_mane.webp', 2),
    ('locations', 'loc_sainikpuri', 'Sainikpuri', '7 AM – Midnight', '/locations/sainikpuri.webp', 3),
    ('locations', 'loc_bengaluru', 'Bengaluru', 'Brewing Soon', '', 4)
ON CONFLICT (section_key, item_key) DO UPDATE SET image_url = EXCLUDED.image_url;
