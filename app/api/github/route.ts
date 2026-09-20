import { NextResponse } from "next/server";
import { getGithubContributions } from "@shared/api/github";

export async function GET() {
  try {
    const data = await getGithubContributions();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
