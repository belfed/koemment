import { getConnInfo } from "@hono/node-server/conninfo";
import { rateLimiter } from "hono-rate-limiter";

export const writeRateLimit = rateLimiter({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: "draft-7",
  keyGenerator: (c) => getConnInfo(c).remote.address ?? "unknown",
  message: { error: "Too many requests, please try again later" },
});
