export const codebaseVisualizerConfig = {
  repo: {
    include: ["src/**", "app/**", "components/**", "lib/**"],
    exclude: ["node_modules/**", ".next/**", "coverage/**"]
  },
  artifacts: {
    repoMap: true,
    dependencyGraph: true,
    docsSummary: true,
    deltaReport: true
  },
  budgets: {
    maxFiles: 2500,
    maxSourceBytes: 3_500_000
  }
} as const;
