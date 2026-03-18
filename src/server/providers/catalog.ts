export type ProviderName = "openai" | "anthropic" | "google";

type ProviderDefinition = {
  label: string;
  recommendedModels: string[];
  defaultUse: string;
};

export const providerCatalog: Record<ProviderName, ProviderDefinition> = {
  openai: {
    label: "OpenAI",
    recommendedModels: ["gpt-4.1", "gpt-4.1-mini"],
    defaultUse: "Narrative docs and system-level explanations"
  },
  anthropic: {
    label: "Anthropic",
    recommendedModels: ["claude-3.7-sonnet"],
    defaultUse: "Change summaries and structured reasoning passes"
  },
  google: {
    label: "Google",
    recommendedModels: ["gemini-2.5-pro"],
    defaultUse: "Large-context repository labeling"
  }
};
