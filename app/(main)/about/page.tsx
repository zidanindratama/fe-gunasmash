import { AboutHero } from "@/components/main/about/about-hero";
import { ContactLocation } from "@/components/main/about/contact-location";
import { MissionValues } from "@/components/main/about/mission-values";
import { CTA } from "@/components/main/cta";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-0">
      <AboutHero />
      <MissionValues />
      <ContactLocation />
      <CTA />
    </div>
  );
}
