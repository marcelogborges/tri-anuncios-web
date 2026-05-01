import { HeroSection } from "./components/hero-section"
import { ProblemsSection } from "./components/problems-section"
import { HowItWorksSection } from "./components/how-it-works-section"
import { PlatformsSection } from "./components/platforms-section"
import { PlansSection } from "./components/plans-section"
import { FinalCtaSection } from "./components/final-cta-section"

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <ProblemsSection />
      <HowItWorksSection />
      <PlatformsSection />
      <PlansSection />
      <FinalCtaSection />
    </>
  )
}
