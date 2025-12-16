import { AboutHero } from "@/components/main/about/about-hero";
import { ContactLocation } from "@/components/main/about/contact-location";
import { MissionValues } from "@/components/main/about/mission-values";
import { CTA } from "@/components/main/cta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the mission, values, and history of GunaSmash Badminton Club. Find our location and contact information.",
  keywords: [
    "GunaSmash Mission",
    "Badminton Club History",
    "Contact GunaSmash",
  ],
};

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
