import { SiteFooter } from "@/components/main/site-footer";
import { SiteNavbar } from "@/components/main/site-navbar";
import * as React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNavbar />
      <main className="min-h-[calc(100dvh-64px-200px)]">{children}</main>
      <SiteFooter />
    </>
  );
}
