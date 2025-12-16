"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop"
          alt="Coming Soon Background"
          className="w-full h-full object-cover opacity-40 grayscale"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 max-w-2xl text-center"
      >
        <span className="text-primary font-mono text-sm uppercase tracking-[0.4em] mb-6 block">
          Get Ready
        </span>

        <h1 className="font-oswald text-6xl md:text-9xl uppercase font-bold mb-6 tracking-tighter leading-none">
          Coming{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
            Soon
          </span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl mb-12 max-w-lg mx-auto font-light">
          We are preparing something legendary for the Gunadarma badminton
          community. Be the first to know when we launch.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12">
          <Input
            placeholder="Enter your email"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12 rounded-full px-6 focus-visible:ring-primary focus-visible:border-primary"
          />
          <Button
            size="lg"
            className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white border-0"
          >
            Notify Me <Bell className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <Link
          href="/"
          className="text-sm text-white/50 hover:text-white hover:underline transition-colors uppercase tracking-widest"
        >
          Back to Homepage
        </Link>
      </motion.div>
    </div>
  );
}
