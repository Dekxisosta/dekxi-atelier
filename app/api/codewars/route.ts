import { NextResponse } from "next/server";

// Codewars integration — not yet implemented.
export async function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
