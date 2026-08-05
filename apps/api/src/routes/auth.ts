import { Hono } from "hono";
import { auth as authClient } from "../lib/auth.js";

export const auth = new Hono();

auth.on(["POST", "GET"], "/api/auth/*", (c) => authClient.handler(c.req.raw));
