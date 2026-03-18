export type ArtifactManifest = {
  sha: string;
  repo: string;
  generatedAt: string;
  outputs: Array<{
    kind: "repo-map" | "dependency-graph" | "docs-summary" | "delta-report";
    title: string;
    confidence: "high" | "medium";
  }>;
};

export function buildArtifactManifest(sha: string, repo: string): ArtifactManifest {
  return {
    sha,
    repo,
    generatedAt: new Date().toISOString(),
    outputs: [
      {
        kind: "repo-map",
        title: "Repository map",
        confidence: "high"
      },
      {
        kind: "dependency-graph",
        title: "Dependency graph",
        confidence: "high"
      },
      {
        kind: "docs-summary",
        title: "Generated documentation summary",
        confidence: "medium"
      },
      {
        kind: "delta-report",
        title: "Delta from previous successful main run",
        confidence: "medium"
      }
    ]
  };
}
