"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="pt-32 pb-20 px-6 md:px-12 bg-background border-b border-border/40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
              Our Story
            </span>
            <h1 className="font-oswald text-5xl md:text-7xl uppercase font-bold leading-[0.9] mb-8">
              More Than <br /> Just a{" "}
              <span className="text-primary">Game.</span>
            </h1>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                GunaSmash was founded in 2024 with a simple vision: To become a
                home for Gunadarma University students to not only play
                badminton but to grow together in sportsmanship.
              </p>
              <p>
                We believe the badminton court is where character is forged.
                Here, discipline meets passion, and rivalry births solid
                friendship.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] w-full rounded-3xl overflow-hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1718179804654-7c3720b78e67?q=80&w=2076&auto=format&fit=crop"
            alt="Gunadarma Team Huddle"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10">
            <p className="font-oswald text-2xl uppercase">Est. 2024</p>
            <p className="text-xs font-mono text-muted-foreground">
              Depok, Indonesia
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
