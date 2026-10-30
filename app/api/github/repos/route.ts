import { NextResponse } from "next/server";
import { getGithubRepos } from "@shared/api/github";

export async function GET() {
  try {
    const repos = await getGithubRepos();
    return NextResponse.json(repos);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
