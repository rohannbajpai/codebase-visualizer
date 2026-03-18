import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const event = request.headers.get("x-github-event") ?? "unknown";

  return NextResponse.json({
    accepted: true,
    event,
    message: "Webhook surface scaffolded. Signature verification comes next."
  });
}
