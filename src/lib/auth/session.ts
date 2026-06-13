import { cache } from "react";

import { redirect } from "next/navigation";

import type { UserRole } from "@/generated/prisma/client";
import { auth } from "@/auth";

const roleRedirectMap = {
  ADMIN: "/admin",
  STUDENT: "/siswa",
} as const;

export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

export async function requireUserRole(role: UserRole) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/masuk?callbackUrl=${encodeURIComponent(roleRedirectMap[role])}`);
  }

  if (user.role !== role) {
    redirect(roleRedirectMap[user.role]);
  }

  return user;
}
