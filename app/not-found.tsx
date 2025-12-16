"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-oswald font-bold text-foreground leading-none select-none">
          404
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg"
      >
        <span className="text-primary font-mono text-sm uppercase tracking-[0.3em] mb-4 block">
          Error 404
        </span>

        <h1 className="font-oswald text-6xl md:text-8xl uppercase font-bold mb-6 leading-none">
          Out of <br /> <span className="text-primary">Bounds</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          The shuttlecock has landed outside the line. The page you are looking
          for might have been moved or doesn't exist.
        </p>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/">Back to Court</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            <Link href="/announcements">See Announcements</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
