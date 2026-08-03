import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { comments } from "./routes/comments.js";
import { posts } from "./routes/posts.js";
import { votes } from "./routes/votes.js";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/", comments);
app.route("/", posts);
app.route("/", votes);

const port = Number(process.env.PORT ?? 1000);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
