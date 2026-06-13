"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, AtSign, CheckSquare, UserRound } from "lucide-react";

import { registerAction, type AuthActionState } from "@/app/actions/auth";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: AuthActionState = {
  message: "",
};

type RegisterFormProps = {
  callbackUrl?: string;
};

export function RegisterForm({ callbackUrl = "" }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-2">
        <label htmlFor="name" className="text-[14px] font-semibold text-[#334155]">
          Nama Lengkap
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#97a4ba]" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan nama lengkap kamu"
            autoComplete="name"
            required
            className="h-12 rounded-2xl border-[#d6dfef] bg-white pl-11 text-[15px] shadow-none placeholder:text-[#9aa7bd]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-[14px] font-semibold text-[#334155]">
          Email
        </label>
        <div className="relative">
          <AtSign className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#97a4ba]" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Masukkan email aktif"
            autoComplete="email"
            required
            className="h-12 rounded-2xl border-[#d6dfef] bg-white pl-11 text-[15px] shadow-none placeholder:text-[#9aa7bd]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-[14px] font-semibold text-[#334155]">
          Password
        </label>
        <PasswordField
          id="password"
          name="password"
          placeholder="Buat password minimal 8 karakter"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-[14px] font-semibold text-[#334155]">
          Konfirmasi Password
        </label>
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Ulangi password"
          autoComplete="new-password"
          required
        />
      </div>

      <label className="flex items-start gap-3 rounded-[18px] border border-[#dce5f4] bg-[#f8fbff] px-4 py-3 text-[14px] leading-6 text-[#5f6d83]">
        <input
          type="checkbox"
          name="agree"
          className="mt-1 size-4 rounded border-[#c7d2e4] text-[#2563eb] accent-[#2563eb]"
        />
        <span>
          Saya setuju dengan syarat dan ketentuan penggunaan TKAMUDAH untuk akun siswa.
        </span>
      </label>

      {state.message ? (
        <div className="rounded-[20px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[14px] text-[#b91c1c]">
          {state.message}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 text-[13px] text-[#73829b]">
        <Link href="/" className="font-semibold transition hover:text-[#1f2f46]">
          Kembali ke beranda
        </Link>
        <Link href="/masuk" className="font-semibold text-[#2563eb] transition hover:text-[#1f58da]">
          Sudah punya akun?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-2xl bg-[#2563eb] text-[15px] font-bold text-white shadow-[0_20px_34px_-24px_rgba(37,99,235,0.9)] hover:bg-[#1f58da]"
      >
        {isPending ? "Membuat akun..." : "Daftar"}
        <ArrowRight className="size-4" />
      </Button>

      <div className="rounded-[18px] border border-dashed border-[#dce5f4] bg-white px-4 py-3 text-[13px] leading-6 text-[#73829b]">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eef3ff] text-[#2563eb]">
            <CheckSquare className="size-4" />
          </div>
          <p>
            Pendaftaran dari halaman ini akan membuat akun <strong>siswa</strong>.
            Jika kamu butuh akun admin, hubungi pengelola sekolah.
          </p>
        </div>
      </div>
    </form>
  );
}
