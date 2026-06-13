"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

import { loginAction, type AuthActionState } from "@/app/actions/auth";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: AuthActionState = {
  message: "",
};

type LoginFormProps = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl = "" }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="rounded-[24px] border border-[#dce5f4] bg-[#f8fbff] px-4 py-3 text-[14px] leading-6 text-[#5f6d83]">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e7efff] text-[#2563eb]">
            <ShieldCheck className="size-4" />
          </div>
          <p>
            Satu halaman login untuk admin dan siswa. Setelah berhasil masuk,
            sistem akan mengarahkanmu ke dashboard yang sesuai.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-[14px] font-semibold text-[#334155]">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#97a4ba]" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Masukkan email kamu"
            autoComplete="email"
            required
            className="h-12 rounded-2xl border-[#d6dfef] bg-white pl-11 text-[15px] shadow-none placeholder:text-[#9aa7bd]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="password" className="text-[14px] font-semibold text-[#334155]">
            Password
          </label>
          <a
            href="mailto:support@tkamudah.id?subject=Bantuan%20Login%20TKAMUDAH"
            className="text-[13px] font-semibold text-[#2563eb] transition hover:text-[#1f58da]"
          >
            Butuh bantuan?
          </a>
        </div>
        <PasswordField
          id="password"
          name="password"
          placeholder="Masukkan password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.message ? (
        <div className="rounded-[20px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[14px] text-[#b91c1c]">
          {state.message}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 text-[13px] text-[#73829b]">
        <Link href="/" className="font-semibold transition hover:text-[#1f2f46]">
          Kembali ke beranda
        </Link>
        <Link href="/daftar" className="font-semibold text-[#2563eb] transition hover:text-[#1f58da]">
          Belum punya akun?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-2xl bg-[#2563eb] text-[15px] font-bold text-white shadow-[0_20px_34px_-24px_rgba(37,99,235,0.9)] hover:bg-[#1f58da]"
      >
        {isPending ? "Memproses login..." : "Masuk"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
