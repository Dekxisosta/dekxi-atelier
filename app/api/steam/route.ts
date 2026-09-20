import { NextRequest, NextResponse } from "next/server";
import { getSteamPlayerSummary } from "@shared/api/steam";

export async function GET(req: NextRequest) {
  const steamid = req.nextUrl.searchParams.get("steamid") ?? undefined;

  try {
    const data = await getSteamPlayerSummary(steamid);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status =
      message === "Missing steamid or API key" ? 400
      : message === "Player not found"         ? 404
      : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
