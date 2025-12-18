import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1720515226352-b0b1dec6813b?q=80&w=2070&auto=format&fit=crop"
            alt="Badminton Aesthetics"
            fill
            className="object-cover opacity-50 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="group flex items-center gap-2 w-fit">
            <span className="font-oswald text-3xl font-bold tracking-tighter uppercase italic text-white group-hover:text-primary transition-colors">
              Guna<span className="text-primary">Smash</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <blockquote className="space-y-2">
            <p className="font-oswald text-4xl uppercase leading-tight">
              "Champions keep playing until they get it right."
            </p>
            <footer className="text-sm font-mono text-white/60 tracking-widest">
              — BILLIE JEAN KING
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-[400px] space-y-6">
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}
