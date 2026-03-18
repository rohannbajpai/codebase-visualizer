import { NextResponse } from "next/server";
import { z } from "zod";

import { processRun } from "@/server/runs/process-run";
import { verifyGitHubActionsIdentity } from "@/server/github/oidc";

const ingestSchema = z.object({
  repository: z.string().min(3),
  branch: z.string().min(1),
  sha: z.string().min(6),
  workflowRunId: z.string().min(1)
});

export async function POST(request: Request) {
  const body = ingestSchema.parse(await request.json());
  const identity = verifyGitHubActionsIdentity(
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  );

  const result = await processRun({
    repository: body.repository,
    branch: body.branch,
    sha: body.sha
  });

  return NextResponse.json({
    accepted: true,
    identity,
    workflowRunId: body.workflowRunId,
    result
  });
}
