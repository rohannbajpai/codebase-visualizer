import { describe, expect, it } from "vitest";

import {
  isTerminalRunStatus,
  runStatuses
} from "@/server/runs/status";

describe("run status helpers", () => {
  it("marks published, failed, and superseded as terminal", () => {
    expect(isTerminalRunStatus("published")).toBe(true);
    expect(isTerminalRunStatus("failed")).toBe(true);
    expect(isTerminalRunStatus("superseded")).toBe(true);
  });

  it("keeps active stages non-terminal", () => {
    for (const status of runStatuses) {
      if (status === "published" || status === "failed" || status === "superseded") {
        continue;
      }

      expect(isTerminalRunStatus(status)).toBe(false);
    }
  });
});
