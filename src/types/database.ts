export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface SectionMediaItem {
  id?: string;
  section_key: string;
  item_key: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      section_media: {
        Row: SectionMediaItem;
        Insert: SectionMediaItem;
        Update: Partial<SectionMediaItem>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          hours: string;
          map_url: string;
          image_url: string | null;
          address: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          hours: string;
          map_url: string;
          image_url?: string | null;
          address?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          hours?: string;
          map_url?: string;
          image_url?: string | null;
          address?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      contact_inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          status?: string;
          created_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}
