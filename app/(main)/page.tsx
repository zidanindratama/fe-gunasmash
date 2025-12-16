import { CTA } from "@/components/main/cta";
import { FAQ } from "@/components/main/faq";
import { Gallery } from "@/components/main/gallery";
import { Hero } from "@/components/main/hero";
import { ProgramGrid } from "@/components/main/program-grid";
import { Stats } from "@/components/main/stats";
import { Testimonials } from "@/components/main/testimonials";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <ProgramGrid />
      <Stats />
      <Testimonials />
      <Gallery />
      <FAQ />
      <CTA />
    </div>
  );
}
