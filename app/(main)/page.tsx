import { About } from "@/components/main/about";
import { AnnouncementSection } from "@/components/main/announcement";
import { CTA } from "@/components/main/cta";
import { Hero } from "@/components/main/hero";
import { Testimonial } from "@/components/main/testimonial";

export default function Home() {
  return (
    <>
      <Hero backgroundUrl="/main/hero.jpg" />
      <About imageUrl="/main/about.avif" />
      <AnnouncementSection />
      <Testimonial />
      <CTA backgroundUrl="/main/cta.jpg" />
    </>
  );
}
