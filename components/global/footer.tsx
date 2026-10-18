"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { NAV_LINKS } from "@/routes/main-routes";

const SOCIAL_LINKS = [
  { label: "Email", href: "mailto:contact@gunasmash.id", icon: Mail },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden pt-20 pb-10">
      <div className="absolute top-0 left-0 w-full overflow-hidden py-3 bg-primary/5 border-b border-primary/10">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap gap-10"
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-sm font-mono uppercase tracking-widest text-primary/60 flex items-center gap-10"
            >
              Gunadarma Badminton Club • Est. 2024 • Elevate Your Game • Smash
              Limits •
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-24">
          <div className="md:col-span-6 flex flex-col h-full pr-0 md:pr-12">
            <div className="mb-6">
              <span className="font-oswald text-4xl font-bold tracking-tighter uppercase italic text-foreground block mb-4">
                Guna<span className="text-primary">Smash</span>
              </span>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              A premium, tech-driven badminton community at Gunadarma
              University. The ultimate hub for students, alumni, and staff to
              unlock their athletic potential in a professional environment.
            </p>

            <div className="mt-8 flex items-center gap-2">
              <div className="h-[1px] w-12 bg-primary/50" />
              <span className="text-xs font-mono uppercase tracking-widest text-primary">
                Official Community
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-6">
              Menu
            </h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-foreground hover:text-primary transition-colors text-lg font-medium w-fit"
                  >
                    <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/auth/sign-in"
                  className="group flex items-center gap-2 text-foreground hover:text-primary transition-colors text-lg font-medium w-fit"
                >
                  <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all duration-300" />
                  Member Area
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-6">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3 mb-10">
              {SOCIAL_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                  aria-label={item.label}
                >
                  <item.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>

            <div>
              <h4 className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Basecamp
              </h4>
              <address className="not-italic text-foreground leading-relaxed">
                Sport Center Campus H<br />
                Gunadarma University
                <br />
                Kelapa Dua, Depok
              </address>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-10 relative">
          <h1 className="font-oswald text-[13.5vw] leading-[0.8] font-bold text-center text-foreground/5 select-none pointer-events-none uppercase tracking-tighter w-full">
            GUNASMASH
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-muted-foreground border-t border-border/40 pt-6">
          <p>© 2025 Gunadarma Smash Club. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button
              onClick={scrollToTop}
              className="hover:text-primary uppercase font-bold tracking-widest transition-colors ml-4"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
