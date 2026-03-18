export const runStatuses = [
  "queued",
  "fetching",
  "analyzing",
  "generating",
  "publishing",
  "published",
  "failed",
  "superseded"
] as const;

export type RunStatus = (typeof runStatuses)[number];

export function isTerminalRunStatus(status: RunStatus): boolean {
  return status === "published" || status === "failed" || status === "superseded";
}
