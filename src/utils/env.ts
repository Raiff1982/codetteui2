import { z } from "zod";

// Extend ImportMetaEnv interface for Vite
declare global {
  interface ImportMetaEnv {
    VITE_API_URL: string;
    VITE_ENV: string;
    VITE_DEBUG: string;
    VITE_DEPLOYMENT_TARGET?: string;
    VITE_SENTRY_DSN?: string;
    VITE_SENTRY_ENVIRONMENT?: string;
  }
}

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_ENV: z.enum(["development", "production"]).default("development"),
  VITE_DEBUG: z.boolean().default(false),
  VITE_DEPLOYMENT_TARGET: z
    .enum(["netlify", "vercel", "cloudflare", "nginx"])
    .optional(),
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_SENTRY_ENVIRONMENT: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_ENV: import.meta.env.VITE_ENV,
    VITE_DEBUG: import.meta.env.VITE_DEBUG === "true",
    VITE_DEPLOYMENT_TARGET: import.meta.env.VITE_DEPLOYMENT_TARGET,
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

// Validate environment variables at startup
export const env = validateEnv();
