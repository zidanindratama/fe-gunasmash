"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export const GALLERY_DATA = [
  {
    id: 1,
    title: "Morning Drill",
    category: "Training",
    image:
      "https://images.unsplash.com/photo-1718452739586-5b467f1f109b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Smash Practice",
    category: "Technique",
    image:
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Tournament Final",
    category: "Event",
    image:
      "https://images.unsplash.com/photo-1717659487323-7783a99bcf61?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Team Briefing",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1595220427358-8cf2ce3d7f89?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Victory Moment",
    category: "Achievement",
    image:
      "https://images.unsplash.com/photo-1724941407869-f8fb46a3cc38?q=80&w=2066&auto=format&fit=crop",
  },
];

export function Gallery() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-12 left-6 md:left-12 z-20 mix-blend-difference text-white pointer-events-none">
          <h2 className="font-oswald text-foreground text-5xl md:text-8xl uppercase font-bold tracking-tighter">
            The <span className="text-primary">Highlights</span>
          </h2>
          <p className="font-mono text-xs uppercase tracking-[0.3em] mt-2">
            Captured Moments • 2024-2025
          </p>
        </div>

        <motion.div
          style={{ x }}
          className="flex gap-4 md:gap-10 pl-6 md:pl-12"
        >
          {GALLERY_DATA.map((item, index) => (
            <div
              key={item.id}
              className="group relative h-[60vh] md:h-[70vh] w-[80vw] md:w-[45vw] flex-shrink-0 overflow-hidden rounded-3xl border border-border/50 bg-muted"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <span className="px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur text-xs font-mono uppercase text-white mb-3 inline-block">
                  {item.category}
                </span>
                <h3 className="font-oswald text-4xl uppercase text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
