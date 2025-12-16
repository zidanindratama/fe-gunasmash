"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8 text-destructive">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <h1 className="font-oswald text-5xl md:text-6xl uppercase font-bold mb-4">
          Access <span className="text-destructive">Denied</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          You don't have the required permissions to enter this area. Please
          contact the administrator if you believe this is a mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/auth/sign-in">Switch Account</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
