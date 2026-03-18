export type FileSummary = {
  path: string;
  role: "entrypoint" | "module" | "config" | "test" | "unknown";
  summary: string;
};

export type RepoGraphNode = {
  id: string;
  label: string;
  kind: "route" | "service" | "job" | "provider" | "infra";
};

export type RepoGraphEdge = {
  from: string;
  to: string;
  reason: string;
};
