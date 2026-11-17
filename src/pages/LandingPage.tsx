
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCatalog from "../components/landing/LandingCatalog";
import LandingLearning from "../components/landing/LandingLearning";
import LandingExam from "../components/landing/LandingExam";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingCatalog />
        <LandingLearning />
        <LandingExam />
      </main>

      <LandingFooter />
    </div>
  );
}
