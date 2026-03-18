import { describe, expect, it } from "vitest";

import { buildArtifactManifest } from "@/server/artifacts/manifest";

describe("artifact manifest builder", () => {
  it("emits all v1 artifact types", () => {
    const manifest = buildArtifactManifest("abc1234", "rohannbajpai/codebase-visualizer");

    expect(manifest.sha).toBe("abc1234");
    expect(manifest.outputs.map((item) => item.kind)).toEqual([
      "repo-map",
      "dependency-graph",
      "docs-summary",
      "delta-report"
    ]);
  });
});
