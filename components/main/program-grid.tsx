"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PROGRAMS_DATA = [
  {
    id: "training",
    title: "REGULAR TRAINING",
    description:
      "Fundamental drills, footwork mastery, and intensive physical conditioning. Guided by experienced coaches to forge resilient athletes.",
    category: "Development",
    image:
      "https://images.unsplash.com/photo-1708312604073-90639de903fc?q=80&w=2070&auto=format&fit=crop",
    colSpan: "md:col-span-2",
  },
  {
    id: "sparring",
    title: "WEEKLY SPARRING",
    description:
      "Match simulations with official scoring. Test your mental fortitude and strategy against various playing styles.",
    category: "Competition",
    image:
      "https://images.unsplash.com/photo-1708312604093-bafcb2fd6e69?q=80&w=2070&auto=format&fit=crop",
    colSpan: "md:col-span-1",
  },
  {
    id: "tournament",
    title: "GUNADARMA CUP",
    description:
      "The most prestigious annual internal tournament. The ultimate stage for members to fight for the championship title.",
    category: "Event",
    image:
      "https://images.unsplash.com/photo-1547934045-2942d193cb49?q=80&w=2070&auto=format&fit=crop",
    colSpan: "md:col-span-3",
  },
];

export function ProgramGrid() {
  return (
    <section className="py-32 px-4 md:px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border/30 pb-10">
        <div>
          <h2 className="font-oswald text-5xl md:text-7xl uppercase font-bold leading-[0.9] mb-6 text-foreground">
            Our <span className="text-primary">Programs</span>
          </h2>
          <p className="text-muted-foreground max-w-lg text-lg">
            Structured curriculum and competitive events designed to take your
            game to the next level.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full px-8 h-12 text-base border-foreground/20 hover:bg-foreground hover:text-background transition-all"
        >
          View Full Schedule
        </Button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[450px] md:auto-rows-[550px]">
        {PROGRAMS_DATA.map((program, index) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              delay: index * 0.15,
              duration: 0.8,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className={`group relative rounded-3xl overflow-hidden bg-card ${program.colSpan} cursor-pointer`}
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <Image
                src={program.image}
                alt={program.title}
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between z-20">
              <div className="flex justify-between items-start">
                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-widest text-white">
                  {program.category}
                </span>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center translate-x-6 -translate-y-6 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <h3 className="font-oswald text-4xl md:text-5xl uppercase text-white mb-2 leading-[0.9] transition-transform duration-500 group-hover:-translate-y-2">
                  {program.title}
                </h3>
                <div className="grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out group-hover:grid-rows-[1fr]">
                  <div className="min-h-0 overflow-hidden">
                    <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl opacity-0 translate-y-4 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0 pb-2">
                      {program.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
