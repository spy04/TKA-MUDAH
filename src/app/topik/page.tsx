import { PublicTopicCatalogView } from "@/components/public-topic-catalog-view";
import { getStudentDashboardData } from "@/lib/student-dashboard";

export default async function TopicsPage() {
  const dashboardData = await getStudentDashboardData();

  return <PublicTopicCatalogView dashboardData={dashboardData} />;
}
