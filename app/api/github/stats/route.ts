import { NextResponse } from "next/server";
import { getGithubStats } from "@shared/api/github";

export async function GET() {
  try {
    const stats = await getGithubStats();
    return NextResponse.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
