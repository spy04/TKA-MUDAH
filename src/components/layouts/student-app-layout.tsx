import { StudentTopbar } from "@/components/navigation/student-topbar";
import { StudentSidebarNav } from "@/components/navigation/student-sidebar-nav";
import { StudentFooter } from "@/components/student-dashboard/student-footer";
import type { SidebarItem } from "@/components/student-dashboard/data";

type StudentAppLayoutProps = {
  children: React.ReactNode;
  displayName: string;
  sidebarMenus: SidebarItem[];
  logoutAction?: (formData: FormData) => void | Promise<void>;
  helperText?: string;
  showPremiumCard?: boolean;
};

export function StudentAppLayout({
  children,
  displayName,
  sidebarMenus,
  logoutAction,
  helperText,
  showPremiumCard = true,
}: StudentAppLayoutProps) {
  const avatarText = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#eef3ff] text-[#1f2f46]">
      <StudentTopbar avatarText={avatarText} />

      <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-6 lg:px-6">
        <StudentSidebarNav
          displayName={displayName}
          menus={sidebarMenus}
          logoutAction={logoutAction}
          helperText={helperText}
          showPremiumCard={showPremiumCard}
        />

        <div className="min-w-0 flex-1">
          {children}
          <div className="min-h-[220px]" />
        </div>
      </div>

      <StudentFooter />
    </main>
  );
}
