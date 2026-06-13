"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";

export type AuthActionState = {
  message: string;
};

const roleRedirectMap = {
  ADMIN: "/admin",
  STUDENT: "/siswa",
} as const;

function sanitizeRedirectTarget(value: FormDataEntryValue | null, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const target = value.trim();

  if (!target.startsWith("/") || target.startsWith("//")) {
    return fallback;
  }

  return target;
}

function mapSignInError(error: AuthError) {
  if (error.type === "CredentialsSignin") {
    return "Email atau password belum sesuai.";
  }

  return "Login belum berhasil. Coba beberapa saat lagi.";
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

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
    select: {
      role: true,
      isActive: true,
    },
  });

  if (!user?.isActive) {
    return { message: "Akun tidak ditemukan atau sudah tidak aktif." };
  }

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo: sanitizeRedirectTarget(
        formData.get("callbackUrl"),
        roleRedirectMap[user.role],
      ),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: mapSignInError(error) };
    }

    throw error;
  }

  return { message: "" };
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const agreed = formData.get("agree");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return { message: "Mohon lengkapi seluruh data pendaftaran." };
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail || !password.trim() || !confirmPassword.trim()) {
    return { message: "Mohon lengkapi seluruh data pendaftaran." };
  }

  if (trimmedName.length < 3) {
    return { message: "Nama lengkap minimal 3 karakter." };
  }

  if (!normalizedEmail.includes("@")) {
    return { message: "Gunakan alamat email yang valid." };
  }

  if (password.length < 8) {
    return { message: "Password minimal 8 karakter." };
  }

  if (password !== confirmPassword) {
    return { message: "Konfirmasi password belum sama." };
  }

  if (agreed !== "on") {
    return { message: "Kamu perlu menyetujui syarat dan ketentuan." };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      isActive: true,
    },
  });

  if (existingUser?.isActive) {
    return { message: "Email ini sudah terdaftar. Silakan masuk." };
  }

  if (existingUser && !existingUser.isActive) {
    return { message: "Akun ini sedang tidak aktif. Hubungi admin sekolah." };
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      role: "STUDENT",
      isActive: true,
    },
  });

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo: sanitizeRedirectTarget(formData.get("callbackUrl"), "/siswa"),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Akun berhasil dibuat, tetapi login otomatis belum berhasil." };
    }

    throw error;
  }

  return { message: "" };
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/masuk",
  });
}
