import "@fontsource-variable/fraunces/wght.css";
import "./gsapSetup";
import "./landing.css";
import useLenis from "./hooks/useLenis";
import FilmGrain from "./FilmGrain";
import Hero from "./sections/Hero";
import FamilyReveal from "./sections/FamilyReveal";
import UrgencyTransition from "./sections/UrgencyTransition";
import PlatformReveal from "./sections/PlatformReveal";
import VerifiedVets from "./sections/VerifiedVets";
import PetJourney from "./sections/PetJourney";
import EmergencyServices from "./sections/EmergencyServices";
import StatsSection from "./sections/StatsSection";
import FinalCTA from "./sections/FinalCTA";
import TopNav from "./TopNav";

export default function LandingPage() {
  useLenis();

  return (
    <main className="relative w-full">
      <FilmGrain />
      <TopNav />
      <Hero />
      <FamilyReveal />
      <UrgencyTransition />
      <PlatformReveal />
      <VerifiedVets />
      <PetJourney />
      <EmergencyServices />
      <StatsSection />
      <FinalCTA />
    </main>
  );
}
