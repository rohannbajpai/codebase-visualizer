import { z } from "zod";

const runtimeSchema = z.object({
  APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/codebase_visualizer"),
  PG_BOSS_SCHEMA: z.string().default("pgboss"),
  R2_BUCKET: z.string().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default("Codebase Visualizer")
});

export type RuntimeEnv = z.infer<typeof runtimeSchema>;

export function getRuntimeEnv(): RuntimeEnv {
  return runtimeSchema.parse({
    APP_URL: process.env.APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    PG_BOSS_SCHEMA: process.env.PG_BOSS_SCHEMA,
    R2_BUCKET: process.env.R2_BUCKET,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME
  });
}
