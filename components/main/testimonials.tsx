"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Raka Adhitya",
    role: "IT Student '21",
    message:
      "The facilities are top-notch. The training is incredibly structured, and I can genuinely feel my stamina and footwork improving drastically.",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "Sarah Wijaya",
    role: "Economics Alumni '23",
    message:
      "A super supportive community. I was hesitant to join as a beginner, but the seniors were very welcoming in teaching the basics.",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    name: "Dimas Pratama",
    role: "Gunadarma Athlete",
    message:
      "The weekly sparring sessions are fiercely competitive. It really helps build the mental toughness needed for inter-campus tournaments.",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: 4,
    name: "Putri Anindya",
    role: "Psychology Student '22",
    message:
      "So much fun! Besides sports, I made so many new friends from different majors. The Gunadarma Cup atmosphere is simply electric.",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border/40 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="font-oswald text-4xl md:text-5xl uppercase font-bold text-foreground">
          Words from the <span className="text-primary">Court</span>
        </h2>
      </div>

      <div className="relative w-full flex overflow-hidden mask-gradient-x">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-l from-background to-transparent" />
        <motion.div
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: "-50%" }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          {[...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[300px] md:w-[400px] h-full flex-shrink-0 bg-background border border-border p-6 md:p-8 rounded-2xl select-none hover:border-primary/50 transition-colors duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-oswald text-lg uppercase tracking-wide">
                    {item.name}
                  </h4>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {item.role}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-normal italic">
                "{item.message}"
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
