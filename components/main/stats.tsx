"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";

export const STATS_DATA = [
  {
    id: "athletes",
    label: "Active Athletes",
    value: 142,
    suffix: "+",
  },
  {
    id: "matches",
    label: "Matches Hosted",
    value: 850,
    suffix: "",
  },
  {
    id: "winrate",
    label: "Club Win Rate",
    value: 68,
    suffix: "%",
  },
  {
    id: "coach",
    label: "Pro Coaches",
    value: 12,
    suffix: "",
  },
];

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(
          Math.floor(latest)
        );
      }
    });
  }, [springValue]);

  return (
    <span className="flex items-baseline">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="py-20 md:py-32 bg-background border-y border-border/40 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-border/30 hidden md:block" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-border/30 hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-0 divide-y md:divide-y-0 divide-border/30 md:divide-none">
          {STATS_DATA.map((stat, index) => (
            <div
              key={stat.id}
              className="flex flex-col items-center justify-center relative group py-8 md:py-0 first:pt-0 last:pb-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center items-center flex flex-col"
              >
                <h3 className="font-oswald text-center text-7xl md:text-8xl font-bold text-foreground tracking-tighter leading-none mb-3 group-hover:text-primary transition-colors duration-500">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </h3>

                <p className="font-mono text-sm md:text-sm uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {stat.label}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
