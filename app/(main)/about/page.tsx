import AboutHero from "@/components/main/about/about-hero";
import ContactLocation from "@/components/main/about/contact-location";
import FAQ from "@/components/main/about/faq";
import MissionValues from "@/components/main/about/mission-values";
import { CTA } from "@/components/main/cta";

export default function About() {
  return (
    <>
      <AboutHero heroImageUrl="/main/about/hero.jpg" />
      <MissionValues />
      <FAQ />
      <ContactLocation />
      <CTA backgroundUrl="/main/cta.jpg" />
    </>
  );
}
