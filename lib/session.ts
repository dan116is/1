import { cookies } from "next/headers";
import { verifySession } from "./auth";
import { prisma } from "../db/prisma";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;
  if (token) {
    const payload = verifySession(token);
    if (payload) {
      return prisma.user.findUnique({ where: { id: payload.userId } });
    }
  }
  return prisma.user.findFirst();
}
