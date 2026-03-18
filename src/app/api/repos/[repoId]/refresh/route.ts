import { NextResponse } from "next/server";

import { processRun } from "@/server/runs/process-run";

type RefreshRouteContext = {
  params: Promise<{
    repoId: string;
  }>;
};

export async function POST(
  _request: Request,
  context: RefreshRouteContext
) {
  const { repoId } = await context.params;

  const result = await processRun({
    repository: repoId,
    branch: "main",
    sha: "manual-rerun"
  });

  return NextResponse.json({
    accepted: true,
    triggeredBy: "manual",
    result
  });
}
