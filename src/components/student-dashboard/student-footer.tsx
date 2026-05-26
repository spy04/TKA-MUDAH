import Link from "next/link";

import {
  contactItems,
  footerLinks,
  socialLinks,
} from "@/components/student-dashboard/data";

export function StudentFooter() {
  return (
    <footer className="bg-[#121b33] px-6 py-12 text-white">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 xl:grid-cols-[1.2fr_0.9fr_1fr_0.95fr]">
          <div>
            <p className="text-[18px] font-black tracking-tight">TKAMUDAH</p>
            <p className="mt-5 text-[14px] font-bold text-[#2563eb]">Belajar TKA Jadi Lebih Mudah</p>
            <p className="mt-5 max-w-[315px] text-[14px] leading-8 text-[#9aa8bf]">
              Platform bimbingan belajar online terbaik yang didedikasikan untuk membantu
              siswa SD dan SMP mempersiapkan TKA dengan metode belajar yang seru, efektif,
              dan terstruktur.
            </p>
          </div>

          <div>
            <p className="text-[16px] font-bold">Navigasi</p>
            <div className="mt-5 space-y-4">
              {footerLinks.map((item) => (
                <Link key={item} href="#materi" className="block text-[14px] text-[#c3ccda] hover:text-white">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[16px] font-bold">Hubungi Kami</p>
            <div className="mt-5 space-y-4 text-[14px] text-[#c3ccda]">
              {contactItems.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 text-[#2563eb]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[12px] font-bold tracking-[0.22em] text-[#d2d8e3]">SOCIAL MEDIA</p>
              <div className="mt-4 flex gap-5">
                {socialLinks.map(({ label, icon: Icon }) => (
                  <div key={label + Icon.displayName} className="text-center">
                    <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-white/8">
                      <Icon className="size-4 text-[#d8dfea]" />
                    </div>
                    <p className="mt-2 text-[11px] text-[#818ca0]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-white/10 bg-white/4 p-5">
            <p className="max-w-[180px] text-[16px] font-bold leading-8">Kerjasama & Partnership</p>
            <p className="mt-4 text-[14px] leading-7 text-[#aab4c7]">
              Tertarik bekerja sama dengan kami untuk memajukan pendidikan di Indonesia?
            </p>
            <Link
              href="#pengaturan"
              className="mt-6 flex h-[42px] items-center justify-center rounded-[10px] bg-[#2563eb] text-[14px] font-bold text-white"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[14px] text-[#7d879b] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 TKAMUDAH. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#pengaturan" className="hover:text-[#c3ccda]">
              Kebijakan Privasi
            </Link>
            <Link href="#pengaturan" className="hover:text-[#c3ccda]">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
