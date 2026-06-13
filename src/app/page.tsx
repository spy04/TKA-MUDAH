import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { StudentDashboardView } from "@/components/student-dashboard-view";
import { getStudentDashboardData } from "@/lib/student-dashboard";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/siswa");
  }

  const dashboardData = await getStudentDashboardData();

  return (
    <StudentDashboardView
      displayName="Adik"
      homeHref="/"
      dashboardData={dashboardData}
    />
  );
}
