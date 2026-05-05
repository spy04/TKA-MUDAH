"use server";

import { redirect } from "next/navigation";

import { createSession, deleteCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";

export type LoginActionState = {
  message: string;
};

const roleRedirectMap = {
  ADMIN: "/admin",
  STUDENT: "/siswa",
} as const;

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const role = formData.get("role");
  const email = formData.get("email");
  const password = formData.get("password");

  if (role !== "ADMIN" && role !== "STUDENT") {
    return { message: "Role login tidak valid." };
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return { message: "Email dan password wajib diisi." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password.trim()) {
    return { message: "Email dan password wajib diisi." };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user || !user.isActive) {
    return { message: "Akun tidak ditemukan atau sudah tidak aktif." };
  }

  if (user.role !== role) {
    return { message: "Role yang dipilih tidak sesuai dengan akun ini." };
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    return { message: "Password yang dimasukkan salah." };
  }

  await createSession(user.id);
  redirect(roleRedirectMap[user.role]);
}

export async function logoutAction() {
  await deleteCurrentSession();
  redirect("/");
}
