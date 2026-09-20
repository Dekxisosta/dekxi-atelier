import { NextResponse } from "next/server";

const LEETCODE_USERNAME = "Dekxi";

const QUERY = `
  query userProblemsSolved($username: String!) {
    matchedUser(username: $username) {
      profile { ranking }
      submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
    }
  }
`;

export async function GET() {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { username: LEETCODE_USERNAME } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("LeetCode fetch failed");

    const json = await res.json();
    const user = json?.data?.matchedUser;
    if (!user) throw new Error("User not found");

    const counts = Object.fromEntries(
      user.submitStatsGlobal.acSubmissionNum.map(
        (d: { difficulty: string; count: number }) => [d.difficulty, d.count]
      )
    );

    return NextResponse.json({
      ranking:      user.profile.ranking ?? null,
      totalSolved:  counts.All    ?? 0,
      easySolved:   counts.Easy   ?? 0,
      mediumSolved: counts.Medium ?? 0,
      hardSolved:   counts.Hard   ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 502 });
  }
}
