import { NextResponse } from "next/server";
import { getDiscordStatus } from "@shared/api/discord";

export async function GET() {
  try {
    const data = await getDiscordStatus();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
