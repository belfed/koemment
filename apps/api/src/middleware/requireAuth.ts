import type { Context, Next } from "hono";
import { auth } from "../lib/auth.js";
import type { AppEnv } from "../types.js";

export async function requireAuth(c: Context<AppEnv>, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  await next();
}
