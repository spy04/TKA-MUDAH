import { TopicCatalogView } from "@/components/topic-catalog-view";
import { getStudentDashboardData } from "@/lib/student-dashboard";

export default async function TopicsPage() {
  const dashboardData = await getStudentDashboardData();

  return (
    <TopicCatalogView
      displayName="Adik"
      homeHref="/"
      dashboardData={dashboardData}
    />
  );
}
