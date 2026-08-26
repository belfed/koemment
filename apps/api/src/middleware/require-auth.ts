import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import { auth } from "../auth.js";

type Env = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
  };
};

export const requireAuth = createMiddleware<Env>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  c.set("user", session.user);

  await next();
});

export async function getOptionalUser(headers: Headers): Promise<typeof auth.$Infer.Session.user | null> {
  const session = await auth.api.getSession({ headers });
  return session?.user ?? null;
}
