import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { comments } from "./routes/comments.js";
import { votes } from "./routes/votes.js";

const port = Number(process.env.PORT ?? 3000);

const app = new Hono();

app.get("/health", (c) => c.json({ status: "healthy" }, 200));

app.route("/", comments);
app.route("/", votes);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
