import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import {logo} from "../../assets";
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

type HeaderProps = {
  activePage?: string;
};

const navigation = [
  { label: "Beranda", href: "/" },
  { label: "Jelajahi Materi", href: "/materi" },
  { label: "Latihan Soal", href: "/latihan" },
  { label: "Persiapan Ujian", href: "/latihan?kind=SIMULATION" },
];

export default function Header({ activePage = "/" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = user?.profile?.displayName || user?.email || "Siswa";
  const educationLabel = user?.profile
    ? `${user.profile.educationLevel} Kelas ${user.profile.grade}`
    : "Akun siswa";

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/materi?q=${encodeURIComponent(query)}` : "/materi");
  }

  async function handleLogout() {
    setProfileMenuOpen(false);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (caught) {
      navigate("/login", {
        replace: true,
        state: {
          notice:
            caught instanceof Error
              ? `Sesi lokal telah dihapus, tetapi server gagal mencatat logout: ${caught.message}`
              : 'Sesi lokal telah dihapus, tetapi server gagal mencatat logout.',
        },
      });
    }
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-stroke bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src={logo}
            alt="Logo BinaSiswa"
            className="h-9 w-auto object-contain"
          />

          <span className="font-heading text-lg font-bold tracking-tight text-brand">
            TKA Mudah
          </span>
        </Link>

        {/* Search Desktop */}
        <form
          onSubmit={submitSearch}
          className="hidden min-w-0 max-w-xs flex-1 items-center gap-2 rounded-lg bg-muted px-3 py-2 lg:flex"
        >
          <Search size={18} className="shrink-0 text-foreground-light" />

          <input
            type="search"
            placeholder="Cari materi, latihan, atau ujian..."
            aria-label="Cari materi, latihan, atau ujian"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-light"
          />
        </form>

        {/* Navigation Desktop */}
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-5 xl:flex"
        >
          {navigation.map((item) => {
            const isActive = activePage === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap font-heading text-sm transition-colors ${
                  isActive
                    ? "font-bold text-brand"
                    : "font-medium text-foreground-muted hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Notification */}
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-muted"
          >
            <Bell size={20} />
          </button>

          {/* Mobile Navigation Toggle */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-muted xl:hidden"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Profile */}
          {user ? <div ref={profileRef} className="relative">
            <button
              type="button"
              aria-label={`Menu profil ${displayName}`}
              aria-haspopup="true"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
                <UserRound size={18} />
              </div>

              <div className="hidden text-left sm:block">
                <p className="font-heading text-xs font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="text-[11px] text-foreground-muted">
                  {educationLabel}
                </p>
              </div>

              <ChevronDown
                size={15}
                className="hidden text-foreground-muted sm:block"
              />
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-stroke bg-card p-1.5 shadow-lg">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <LayoutDashboard size={17} />
                  Dashboard Siswa
                </Link>

                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-muted">
                  <UserRound size={17} />
                  {displayName}
                </div>

                <div className="my-1 border-t border-stroke" />

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Keluar
                </button>
              </div>
            )}
          </div> : (
            <Link
              to="/login"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Navigation */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi mobile"
          className="border-t border-stroke bg-card px-4 py-3 xl:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => {
              const isActive = activePage === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 font-heading text-sm ${
                    isActive
                      ? "bg-muted font-bold text-brand"
                      : "text-foreground-muted hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
