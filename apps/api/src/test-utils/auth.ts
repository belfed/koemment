import { randomUUID } from "node:crypto";

import { auth } from "../lib/auth.js";

export async function signUpTestUser() {
  const email = `test-${randomUUID()}@example.com`;
  const password = "password123456";

  const response = await auth.api.signUpEmail({
    body: { email, password, name: "Test User" },
    asResponse: true,
  });

  const { user } = (await response.json()) as { user: { id: string } };
  const cookie = response.headers
    .getSetCookie()
    .map((entry) => entry.split(";")[0])
    .join("; ");

  return { user, headers: { cookie } };
}
