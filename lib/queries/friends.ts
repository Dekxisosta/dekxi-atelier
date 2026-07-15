import { createClient } from "@/lib/supabase/server";
import { shuffle } from "@/lib/utils/shuffle";
import type { Friend } from "@/lib/types/friend";

export async function getFriends(): Promise<Friend[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("friends").select("*");
  if (error) {
    console.error("Failed to load friends from Supabase:", error.message);
    return [];
  }
  return shuffle(data || []);
}