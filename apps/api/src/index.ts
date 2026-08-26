import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { auth, trustedOrigins } from "./auth.js";
import { comments } from "./routes/comments.js";
import { votes } from "./routes/votes.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: trustedOrigins,
    credentials: true,
  }),
);

app.get("/health", (c) => c.json({ status: "healthy" }, 200));

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/", comments);
app.route("/", votes);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
