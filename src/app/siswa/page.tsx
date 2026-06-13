import { logoutAction } from "@/app/actions/auth";
import { StudentHomeDashboard } from "@/components/student-home-dashboard";
import { requireUserRole } from "@/lib/auth/session";
import { getStudentDashboardData } from "@/lib/student-dashboard";

export default async function StudentPage() {
  const user = await requireUserRole("STUDENT");
  const dashboardData = await getStudentDashboardData();

  return (
    <StudentHomeDashboard
      displayName={user.name?.trim() || "Adik"}
      dashboardData={dashboardData}
      logoutAction={logoutAction}
    />
  );
}
