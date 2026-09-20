import { createClient } from "@shared/supabase/server";
import { shuffle } from "@shared/utils/shuffle";
import type { Friend } from "./types";

export async function getFriends(): Promise<Friend[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("friends").select("*");
  if (error) {
    console.error("Failed to load friends from Supabase:", error.message);
    return [];
  }
  return shuffle(data || []);
}

export async function getFriendById(id: string): Promise<Friend | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}
