import "dotenv/config";

import { db } from "../src/db/index.js";
import { auth } from "../src/lib/auth.js";

async function main() {
  const post = await db.post.upsert({
    where: { id: "demo-post" },
    create: { id: "demo-post", commentCount: 0, readOnly: false },
    update: {},
  });

  const existingUser = await db.user.findUnique({ where: { email: "demo@koemment.dev" } });
  const user =
    existingUser ??
    (
      await auth.api.signUpEmail({
        body: { email: "demo@koemment.dev", password: "password123456", name: "Demo User" },
      })
    ).user;

  const existingComment = await db.comment.findFirst({ where: { postId: post.id, userId: user.id } });

  if (!existingComment) {
    await db.$transaction([
      db.comment.create({
        data: {
          postId: post.id,
          userId: user.id,
          textMd: "Welcome to koemment!",
          textHtml: "Welcome to koemment!",
        },
      }),
      db.post.update({ where: { id: post.id }, data: { commentCount: { increment: 1 } } }),
    ]);
  }

  console.log("Seed complete:", { postId: post.id, userId: user.id });
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
