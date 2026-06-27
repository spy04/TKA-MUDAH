import { PublicTopNavbar } from "@/components/navigation/public-top-navbar";
import { StudentFooter } from "@/components/student-dashboard/student-footer";
import type { NavItem } from "@/components/student-dashboard/data";

type PublicContentLayoutProps = {
  children: React.ReactNode;
  homeHref: string;
  menus: NavItem[];
};

export function PublicContentLayout({
  children,
  homeHref,
  menus,
}: PublicContentLayoutProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eaf1ff_0%,#f7faff_100%)] text-[#1f2f46]">
      <PublicTopNavbar homeHref={homeHref} menus={menus} />

      <div className="bg-transparent">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-6">
          {children}
          <div className="min-h-[220px]" />
        </div>
      </div>

      <StudentFooter />
    </main>
  );
}
