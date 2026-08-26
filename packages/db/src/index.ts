import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

export * from "./generated/prisma/client.js";

export type CommentWithAuthorAndVote = {
  id: string;
  content: string;
  score: number;
  createdAt: Date;
  parentId: string | null;
  postId: string;
  author: { name: string; image: string | null };
  myVote: 1 | -1 | null;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
export default prisma
