"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

type PasswordFieldProps = {
  id: string;
  name: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
};

export function PasswordField({
  id,
  name,
  placeholder,
  autoComplete,
  required,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="h-12 rounded-2xl border-[#d6dfef] bg-white pr-12 text-[15px] shadow-none placeholder:text-[#9aa7bd]"
      />
      <button
        type="button"
        onClick={() => setIsVisible((value) => !value)}
        className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#7c8aa5] transition hover:bg-[#f3f6fc] hover:text-[#1f2f46]"
        aria-label={isVisible ? "Sembunyikan password" : "Tampilkan password"}
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
