import { PublicExerciseCategoryListView } from "@/components/public-exercise-category-list-view";
import { getPublicExerciseCategories } from "@/lib/public-content";

export default async function LatihanLandingPage() {
  const categories = await getPublicExerciseCategories();
  return <PublicExerciseCategoryListView categories={categories} />;
}
