import { NextResponse } from "next/server";

import { getRuntimeEnv } from "@/server/env";

export async function GET() {
  const env = getRuntimeEnv();

  return NextResponse.json({
    status: "ok",
    app: env.NEXT_PUBLIC_APP_NAME,
    bucketConfigured: Boolean(env.R2_BUCKET)
  });
}
