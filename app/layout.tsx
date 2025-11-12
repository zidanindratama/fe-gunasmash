import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TanStackProvider from "@/providers/tanstack-query-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GunaSmash | UKM Bulutangkis Universitas Gunadarma",
    template: "%s | GunaSmash",
  },
  description:
    "GunaSmash adalah UKM Bulutangkis Universitas Gunadarma — wadah mahasiswa untuk berlatih, bertanding, dan berkembang dalam dunia bulutangkis.",
  keywords: [
    "GunaSmash",
    "UKM Bulutangkis Gunadarma",
    "Badminton Club Gunadarma",
    "Universitas Gunadarma",
    "UKM UG",
    "Bulutangkis Kampus",
  ],
  authors: [
    {
      name: "Muhamad Zidan Indratama",
      url: "https://zidanindratama.vercel.app",
    },
  ],
  creator: "Muhamad Zidan Indratama",
  publisher: "GunaSmash",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanStackProvider>
            <main>{children}</main>
            <Toaster position="top-center" />
          </TanStackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
