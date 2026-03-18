import { NextResponse } from "next/server";
import { z } from "zod";

import {
  providerCatalog,
  type ProviderName
} from "@/server/providers/catalog";

const providerSchema = z.object({
  provider: z.enum(["openai", "anthropic", "google"]),
  apiKey: z.string().min(10)
});

export async function POST(request: Request) {
  const body = providerSchema.parse(await request.json());
  const definition = providerCatalog[body.provider as ProviderName];

  return NextResponse.json({
    ok: true,
    provider: definition.label,
    recommendedModels: definition.recommendedModels,
    note: "This is a scaffolded validator. Wire the real provider ping next."
  });
}
