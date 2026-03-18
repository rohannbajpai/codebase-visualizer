import { processRun } from "@/server/runs/process-run";

export async function processRunJob(payload: {
  repository: string;
  sha: string;
  branch: string;
}) {
  return processRun(payload);
}
