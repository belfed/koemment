import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";

import { db } from "../db/index.js";

const syncToken = process.env.SYNC_TOKEN;
if (!syncToken) {
  throw new Error("SYNC_TOKEN is not set: required to protect POST /posts/sync");
}

export const posts = new Hono();

posts.post("/posts/sync", bearerAuth({ token: syncToken }), async (c) => {
  const body = await c.req.json<{ posts: { id: string; readOnly?: boolean }[] }>();

  if (!Array.isArray(body.posts)) {
    return c.json({ error: "posts must be an array" }, 400);
  }

  await db.$transaction(
    body.posts.map((post) =>
      db.post.upsert({
        where: { id: post.id },
        create: { id: post.id, commentCount: 0, readOnly: post.readOnly ?? false },
        update: { readOnly: post.readOnly ?? false },
      }),
    ),
  );

  return c.json({ synced: body.posts.length });
});
