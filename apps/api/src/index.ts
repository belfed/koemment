import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { auth } from "./routes/auth.js";
import { comments } from "./routes/comments.js";
import { posts } from "./routes/posts.js";
import { votes } from "./routes/votes.js";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));
app.use(
  "*",
  cors({
    origin: process.env.BLOG_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.route("/", auth);
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
