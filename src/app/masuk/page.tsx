import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/siswa");
  }

  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : "";

  return (
    <AuthPageShell
      title="Masuk ke Akun"
      description="Lanjutkan perjalanan belajarmu bersama TKAMUDAH dengan akun yang sudah terdaftar."
      imageSrc="/login_tkamudah.png"
      imageAlt="Ilustrasi siswa sedang belajar"
      heroTitle="Belajar Lebih Mudah & Terarah"
      heroDescription="Platform lengkap dengan modul, video, latihan soal, dan simulasi TKA untuk siswa SD & SMP."
      accent="light"
    >
      <LoginForm callbackUrl={callbackUrl} />
    </AuthPageShell>
  );
}
