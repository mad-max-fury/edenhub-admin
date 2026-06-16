// Per-environment config. Values come from the active Vite mode file
// (.env.development / .env.staging / .env.production), overridable by an
// untracked local `.env`.
export const apiUrl = import.meta.env.VITE_BASEAPI ?? "";

// "development" | "staging" | "production" — resolved at build time.
export const appEnv =
  (import.meta.env.VITE_APP_ENV as string) ?? import.meta.env.MODE;

export const isProd = appEnv === "production";
