"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeNewsletter(email: string) {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please provide a valid email address." };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email: email.toLowerCase().trim() }])
      .select();

    if (error) {
      // If already subscribed (duplicate key), treat as success gracefully
      if (error.code === "23505") {
        return { success: true, message: "You are already subscribed." };
      }
      console.error("Newsletter subscription error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to subscribe";
    console.error("Newsletter subscription action error:", err);
    return { success: false, error: message };
  }
}
