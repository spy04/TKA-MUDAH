import { logoutAction } from "@/app/actions/auth";
import { StudentTopicCatalogView } from "@/components/student-topic-catalog-view";
import { requireUserRole } from "@/lib/auth/session";
import { getStudentDashboardData } from "@/lib/student-dashboard";

export default async function StudentTopicsPage() {
  const user = await requireUserRole("STUDENT");
  const dashboardData = await getStudentDashboardData();

  return (
    <StudentTopicCatalogView
      displayName={user.name?.trim() || "Adik"}
      dashboardData={dashboardData}
      logoutAction={logoutAction}
    />
  );
}
