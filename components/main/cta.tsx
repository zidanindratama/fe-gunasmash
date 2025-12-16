"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "10%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <Image
          src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop"
          alt="Badminton Smash Action"
          fill
          className="object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="px-4 py-2 border-b border-primary/50 text-white text-xs font-mono uppercase tracking-[0.4em]">
            Join the Legacy
          </span>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-oswald text-5xl md:text-8xl font-bold uppercase text-white tracking-tighter mb-6 leading-[0.9]"
        >
          Become a <span className="text-primary">Legend</span>
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-lg text-white/70 text-base md:text-lg mb-10 leading-relaxed font-light"
        >
          Don&apos;t just watch from the sidelines. Grab your racket, forge a
          champion's mindset, and carve your history with GunaSmash.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            className="h-16 px-10 rounded-full text-lg bg-primary hover:bg-primary/90 text-white border-0 shadow-[0_0_40px_-10px_var(--primary)] hover:shadow-[0_0_60px_-15px_var(--primary)] transition-all duration-300"
            asChild
          >
            <Link href="/auth/sign-up">
              Register Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-16 px-10 rounded-full text-lg border-white/20 text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300"
            asChild
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
