"use server";

import { createClient } from "@/lib/supabase/server";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function submitContactInquiry(formData: ContactFormData) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_inquiries")
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: "new",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase inquiry insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit inquiry";
    console.error("Contact inquiry server action error:", err);
    return { success: false, error: message };
  }
}
