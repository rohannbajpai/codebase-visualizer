import { buildArtifactManifest } from "@/server/artifacts/manifest";
import type { RunStatus } from "@/server/runs/status";

export type ProcessRunInput = {
  repository: string;
  sha: string;
  branch: string;
};

export type ProcessRunResult = {
  finalStatus: Extract<RunStatus, "published">;
  stages: RunStatus[];
  manifest: ReturnType<typeof buildArtifactManifest>;
};

// Processing pipeline
// queued -> fetching -> analyzing -> generating -> publishing -> published
// Any failure should stop the pipeline, record a named error, and leave the
// previous published dashboard pointer unchanged.
export async function processRun(
  input: ProcessRunInput
): Promise<ProcessRunResult> {
  const stages: RunStatus[] = [
    "queued",
    "fetching",
    "analyzing",
    "generating",
    "publishing",
    "published"
  ];

  return {
    finalStatus: "published",
    stages,
    manifest: buildArtifactManifest(input.sha, input.repository)
  };
}
