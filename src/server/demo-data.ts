export const demoWorkspace = {
  name: "Signal Atelier",
  repo: "rohannbajpai/codebase-visualizer",
  branch: "main",
  lastRunAt: "5 minutes ago",
  lastSha: "7d3a9c1",
  status: "Published"
};

export const demoMetrics = [
  {
    label: "Tracked components",
    value: "34",
    note: "Services, jobs, dashboards, infra"
  },
  {
    label: "Docs freshness",
    value: "97%",
    note: "Compared to the latest merge on main"
  },
  {
    label: "Run latency",
    value: "4m 12s",
    note: "Medium repository on the cheap path"
  },
  {
    label: "Providers configured",
    value: "3",
    note: "OpenAI, Anthropic, Google"
  }
] as const;

export const demoFlows = [
  {
    title: "Main branch ingestion",
    detail: "GitHub Action signs a run, the worker materializes a repo snapshot, and the dashboard swaps to the newest successful artifact set."
  },
  {
    title: "Provider key onboarding",
    detail: "Owners paste keys once, validate them immediately, and assign a default model policy per repository."
  },
  {
    title: "Artifact publishing",
    detail: "Mermaid, markdown, and JSON manifests are versioned by commit SHA so stale dashboards never overwrite newer work."
  }
] as const;

export const demoArtifacts = [
  {
    kind: "Architecture atlas",
    coverage: "Repo map, dependency graph, ownership seams",
    confidence: "High"
  },
  {
    kind: "Merge delta report",
    coverage: "What changed since the previous successful main run",
    confidence: "High"
  },
  {
    kind: "Generated docs",
    coverage: "Component summaries, operational notes, empty-state warnings",
    confidence: "Medium"
  }
] as const;

export const demoProviders = [
  {
    name: "OpenAI",
    recommendedModel: "gpt-4.1",
    policy: "Narrative docs"
  },
  {
    name: "Anthropic",
    recommendedModel: "claude-3.7-sonnet",
    policy: "Change summaries"
  },
  {
    name: "Google",
    recommendedModel: "gemini-2.5-pro",
    policy: "Large-context repository labeling"
  }
] as const;

export const demoRunTimeline = [
  {
    stage: "queued",
    summary: "Action trigger accepted from GitHub"
  },
  {
    stage: "fetching",
    summary: "Repository archive and config pulled with app credentials"
  },
  {
    stage: "generating",
    summary: "Provider outputs validated against artifact schemas"
  },
  {
    stage: "published",
    summary: "Latest dashboard pointer switched to the new commit"
  }
] as const;
