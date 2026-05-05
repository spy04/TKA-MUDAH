"use client";

import { useActionState, useState } from "react";
import { ArrowRight, KeyRound, ShieldCheck, UserRound } from "lucide-react";

import { loginAction, type LoginActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const initialState: LoginActionState = {
  message: "",
};

export function LoginForm() {
  const [role, setRole] = useState<"ADMIN" | "STUDENT">("ADMIN");
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <Card className="border-border/70 bg-background/95 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <KeyRound className="size-5" />
        </div>
        <div>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Gunakan akun yang sudah terdaftar.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="role" value={role} />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`rounded-2xl border p-4 text-left transition ${
                role === "ADMIN"
                  ? "border-primary bg-primary/8"
                  : "border-border bg-card hover:bg-muted/30"
              }`}
            >
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <p className="mt-4 font-medium text-foreground">Admin</p>
              <p className="mt-1 text-sm text-muted-foreground">Panel admin</p>
            </button>

            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`rounded-2xl border p-4 text-left transition ${
                role === "STUDENT"
                  ? "border-primary bg-primary/8"
                  : "border-border bg-card hover:bg-muted/30"
              }`}
            >
              <div className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <UserRound className="size-5" />
              </div>
              <p className="mt-4 font-medium text-foreground">Siswa</p>
              <p className="mt-1 text-sm text-muted-foreground">Area siswa</p>
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
            />
          </div>

          {state.message ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
              {state.message}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>{role === "ADMIN" ? "Login admin" : "Login siswa"}</span>
            <button
              type="reset"
              className="transition hover:text-foreground"
              onClick={() => setRole("ADMIN")}
            >
              Reset form
            </button>
          </div>

          <Button type="submit" className="h-11 w-full justify-between px-4" disabled={isPending}>
            {isPending ? "Memproses login..." : "Masuk ke dashboard"}
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
