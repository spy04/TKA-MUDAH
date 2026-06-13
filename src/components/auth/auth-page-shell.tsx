import Image from "next/image";
import Link from "next/link";

type AuthPageShellProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  heroTitle: string;
  heroDescription: string;
  accent?: "light" | "primary";
  children: React.ReactNode;
};

const heroAccentClasses = {
  light:
    "border-l border-[#e6edfb] bg-[linear-gradient(180deg,#eef3ff_0%,#f7f9ff_100%)]",
  primary:
    "border-l border-[#234ae5] bg-[linear-gradient(180deg,#3e63f6_0%,#1f4ae5_100%)]",
} as const;

const heroTitleClasses = {
  light: "text-[#1f2f46]",
  primary: "text-white",
} as const;

const heroDescriptionClasses = {
  light: "text-[#5f6d83]",
  primary: "text-white/84",
} as const;

export function AuthPageShell({
  title,
  description,
  imageSrc,
  imageAlt,
  heroTitle,
  heroDescription,
  accent = "light",
  children,
}: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-[#f5f8ff] text-[#1f2f46]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col">
        <header className="border-b border-[#e6edfb] bg-white/96 backdrop-blur">
          <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
            <Link href="/" className="text-[17px] font-black tracking-tight text-[#2563eb]">
              TKAMUDAH
            </Link>

            <div className="flex items-center gap-3 text-[14px] font-semibold">
              <Link href="/" className="hidden text-[#5f6d83] transition hover:text-[#1f2f46] sm:inline-flex">
                Kembali ke beranda
              </Link>
              <Link
                href="/masuk"
                className="rounded-full px-4 py-2 text-[#2563eb] transition hover:bg-[#eef3ff]"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-full bg-[#2563eb] px-5 py-2.5 text-white shadow-[0_16px_30px_-22px_rgba(37,99,235,0.85)] transition hover:bg-[#1f58da]"
              >
                Daftar
              </Link>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.96fr)]">
          <div className="flex items-center justify-center px-6 py-10 lg:px-12 lg:py-14">
            <div className="w-full max-w-[430px]">
              <p className="text-[13px] font-bold tracking-[0.18em] text-[#2563eb] uppercase">
                {title}
              </p>
              <h1 className="mt-4 text-[40px] leading-[1.08] font-black tracking-tight text-[#1f2f46]">
                {title}
              </h1>
              <p className="mt-4 max-w-[360px] text-[15px] leading-7 text-[#5f6d83]">
                {description}
              </p>

              <div className="mt-8">{children}</div>
            </div>
          </div>

          <div className={`relative overflow-hidden px-8 py-12 lg:px-12 lg:py-14 ${heroAccentClasses[accent]}`}>
            <div className="absolute left-10 top-14 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-10 right-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
              <div className="relative w-full max-w-[360px]">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={640}
                  height={640}
                  priority
                  className="mx-auto h-auto w-full max-w-[320px] object-contain drop-shadow-[0_30px_40px_rgba(15,23,42,0.18)]"
                />
              </div>

              <h2 className={`mt-8 max-w-[420px] text-[42px] leading-[1.12] font-black tracking-tight ${heroTitleClasses[accent]}`}>
                {heroTitle}
              </h2>
              <p className={`mt-4 max-w-[430px] text-[17px] leading-8 ${heroDescriptionClasses[accent]}`}>
                {heroDescription}
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#e6edfb] bg-white/96">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-6 py-5 text-[13px] text-[#5f6d83] sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <div className="flex items-center gap-3">
              <span className="font-black text-[#1f2f46]">TKAMUDAH</span>
              <span>© 2026 TKAMUDAH Indonesia. All Rights Reserved.</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/" className="transition hover:text-[#1f2f46]">
                Kebijakan Privasi
              </Link>
              <Link href="/" className="transition hover:text-[#1f2f46]">
                Syarat & Ketentuan
              </Link>
              <a href="mailto:support@tkamudah.id" className="transition hover:text-[#1f2f46]">
                Hubungi Kami
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
