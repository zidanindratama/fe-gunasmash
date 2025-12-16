"use client";

import { motion } from "framer-motion";
import { Target, Users, Zap } from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Excellence",
    desc: "We pursue the highest standards in every training and competition. Good is not enough.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "More than just a club, we are a family. A solid support system both on and off the court.",
  },
  {
    icon: Zap,
    title: "Discipline",
    desc: "Consistency is key. We deeply value time, hard work, and the continuous process.",
  },
];

export function MissionValues() {
  return (
    <section className="py-24 px-6 md:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-oswald text-4xl md:text-5xl uppercase font-bold mb-6">
            The <span className="text-primary">GunaSmash</span> Way
          </h2>
          <p className="text-muted-foreground text-lg">
            The values that underpin every shot, every step, and every victory
            we achieve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-background border border-border p-8 rounded-2xl hover:border-primary/50 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <val.icon className="w-7 h-7" />
              </div>
              <h3 className="font-oswald text-2xl uppercase mb-4">
                {val.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
