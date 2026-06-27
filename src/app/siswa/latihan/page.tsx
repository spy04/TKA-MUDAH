import { requireUserRole } from "@/lib/auth/session";
import { logoutAction } from "@/app/actions/auth";
import { StudentExerciseCategoryListView } from "@/components/student-exercise-category-list-view";
import { getPublicExerciseCategories } from "@/lib/public-content";

export default async function StudentLatihanLandingPage() {
  const user = await requireUserRole("STUDENT");
  const categories = await getPublicExerciseCategories();

  return (
    <StudentExerciseCategoryListView
      categories={categories}
      displayName={user.name?.trim() || "Adik"}
      logoutAction={logoutAction}
    />
  );
}
