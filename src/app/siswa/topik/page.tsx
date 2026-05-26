import { logoutAction } from "@/app/actions/auth";
import { TopicCatalogView } from "@/components/topic-catalog-view";
import { requireUserRole } from "@/lib/auth/session";
import { getStudentDashboardData } from "@/lib/student-dashboard";

export default async function StudentTopicsPage() {
  const user = await requireUserRole("STUDENT");
  const dashboardData = await getStudentDashboardData();

  return (
    <TopicCatalogView
      displayName={user.name?.trim() || "Adik"}
      homeHref="/siswa"
      dashboardData={dashboardData}
      isEnrolled
      logoutAction={logoutAction}
    />
  );
}
