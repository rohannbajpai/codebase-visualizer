import type { RunStatus } from "@/server/runs/status";

export type WorkspaceRecord = {
  id: string;
  name: string;
  ownerUserId: string;
  publishedRunId: string | null;
};

export type RepositoryRecord = {
  id: string;
  workspaceId: string;
  owner: string;
  name: string;
  defaultBranch: string;
  status: "pending_setup" | "active" | "disabled" | "error";
};

export type RunRecord = {
  id: string;
  repositoryId: string;
  sha: string;
  branch: string;
  status: RunStatus;
  triggerSource: "github_action" | "manual";
  errorCode: string | null;
};
