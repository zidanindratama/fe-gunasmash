"use client";

import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactLocation() {
  return (
    <section className="py-24 px-6 md:px-12 bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <h2 className="font-oswald text-4xl md:text-6xl uppercase font-bold mb-8">
            Come & <span className="text-primary">Visit Us</span>
          </h2>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-oswald text-xl uppercase mb-1">Basecamp</h4>
                <p className="text-muted-foreground">
                  Sport Center Campus H, Gunadarma University
                  <br />
                  Jl. Akses UI, Tugu, Kec. Cimanggis, Depok
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-oswald text-xl uppercase mb-1">
                  Training Hours
                </h4>
                <p className="text-muted-foreground">
                  Wednesday: 16:00 - 20:00
                  <br />
                  Friday: 16:00 - 21:00 (Sparring)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-oswald text-xl uppercase mb-1">Contact</h4>
                <p className="text-muted-foreground">
                  join@gunasmash.id
                  <br />
                  +62 812-9102-0590 (Sport Center Admin)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Button size="lg" className="rounded-full px-8" asChild>
              <a
                href="https://maps.app.goo.gl/xyz"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </Button>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[500px] w-full bg-muted rounded-3xl overflow-hidden border border-border grayscale hover:grayscale-0 transition-all duration-500">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Sports+Center+Gunadarma,+Jl.+Akses+UI,+Tugu,+Kec.+Cimanggis,+Kota+Depok&t=&z=15&ie=UTF8&iwloc=&output=embed"
            title="Lokasi Sport Center Gunadarma"
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-primary/5 pointer-events-none mix-blend-overlay" />
        </div>
      </div>
    </section>
  );
}
