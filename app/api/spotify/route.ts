import { NextResponse } from "next/server";
import { getSpotifyData } from "@/lib/queries/spotify";

export async function GET() {
  try {
    const data = await getSpotifyData();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}