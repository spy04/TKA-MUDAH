import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "@/components/auth/register-form";

type RegisterPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/siswa");
  }

  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : "";

  return (
    <AuthPageShell
      title="Buat Akun Baru"
      description="Lengkapi data di bawah untuk memulai perjalanan belajar yang lebih rapi, jelas, dan terarah."
      imageSrc="/signup_tkamudah.png"
      imageAlt="Ilustrasi siswa siap belajar"
      heroTitle="Mulai Petualangan Belajarmu"
      heroDescription="Gabung dengan siswa lainnya dan kuasai TKA lewat materi, latihan, dan simulasi yang lebih seru."
      accent="primary"
    >
      <RegisterForm callbackUrl={callbackUrl} />
    </AuthPageShell>
  );
}
