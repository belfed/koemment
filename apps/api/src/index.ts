import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import { Prisma } from "./generated/prisma/client.js";
import { auth } from "./routes/auth.js";
import { comments } from "./routes/comments.js";
import { posts } from "./routes/posts.js";
import { votes } from "./routes/votes.js";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));
app.use(
  "*",
  cors({
    origin: process.env.APP_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.route("/", auth);
app.route("/", comments);
app.route("/", posts);
app.route("/", votes);

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return c.json({ error: "Not found" }, 404);
    }
  }

  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

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
