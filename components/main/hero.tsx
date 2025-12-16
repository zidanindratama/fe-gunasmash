"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVars: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4 pt-32 pb-20">
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen dark:bg-primary/15" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto flex flex-col items-center text-center z-10"
      >
        <motion.div variants={itemVars} className="mb-6 md:mb-8">
          <span className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em]">
            Gunadarma University
          </span>
        </motion.div>

        <motion.h1
          variants={itemVars}
          className="font-oswald text-[13vw] leading-[0.9] font-bold uppercase tracking-tighter text-foreground md:text-[9rem] relative py-2"
        >
          {"SMASH LIMITS".split(" ").map((word, i) => (
            <span
              key={i}
              className={`inline-block mx-2 md:mx-4 ${
                i === 1
                  ? "text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50"
                  : ""
              }`}
            >
              {word}
            </span>
          ))}
        </motion.h1>

        <motion.h2
          variants={itemVars}
          className="font-oswald text-[4vw] md:text-[3rem] font-light uppercase tracking-tight text-primary mt-2 md:mt-4"
        >
          ELEVATE YOUR GAME
        </motion.h2>

        <motion.p
          variants={itemVars}
          className="mt-6 md:mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          The premier tech-driven badminton community at Gunadarma. Structured
          training, competitive sparring, and professional club management.
        </motion.p>

        <motion.div
          variants={itemVars}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-5 items-center"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full h-14 px-10 text-base font-semibold tracking-wide shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
          >
            <Link href={"/auth/sign-up"} className="flex items-center gap-2">
              Join the Club <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="rounded-full h-14 px-8 text-base text-foreground hover:bg-foreground/5"
          >
            <Link href={"/training"}>Explore Activities</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-semibold">
          Scroll Down
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
