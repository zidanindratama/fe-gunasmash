"use client";

import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest mb-8 border border-primary/20">
          <Hammer className="w-4 h-4" />
          Under Maintenance
        </div>

        <h1 className="font-oswald text-5xl md:text-7xl uppercase font-bold mb-6">
          Polishing the <br /> <span className="text-primary">Court</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          We are currently performing scheduled maintenance to improve your
          experience. We'll be back online shortly. Thank you for your patience.
        </p>

        <div className="mt-8">
          <Button
            asChild
            variant="link"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/">Try to Refresh</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
