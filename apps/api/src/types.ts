// apps/api/src/types.ts
import type { auth } from "./lib/auth.js";

export type AppEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
  };
};