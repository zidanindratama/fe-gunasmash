import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import TanStackProvider from "@/providers/tanstack-query-provider";
import AuthProvider from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://fe-gunasmash.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GunaSmash | Elevate Your Game",
    template: "%s | GunaSmash",
  },
  description:
    "Official portal for GunaSmash, a premium badminton community. Find training schedules, manage attendance, read game analysis blogs, and elevate your skills.",
  applicationName: "GunaSmash",
  authors: [{ name: "Zidan Indratama", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "Badminton Club",
    "GunaSmash",
    "Komunitas Badminton",
    "Training Schedule",
    "Badminton Blog",
    "Gunadarma",
    "Next.js App",
  ],
  creator: "Zidan Indratama",
  publisher: "Zidan Indratama",
  category: "Sports",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "GunaSmash | Elevate Your Game",
    description:
      "Official portal for GunaSmash Badminton Club. Check schedules, read blogs, and manage membership.",
    siteName: "GunaSmash",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GunaSmash Club Cover Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GunaSmash | Badminton Community",
    description:
      "Official portal for GunaSmash Badminton Club. Elevate Your Game.",
    images: ["/og-image.png"],
    creator: "@zidanindratama",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFAF0" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased font-sans bg-background text-foreground overflow-x-hidden selection:bg-foreground selection:text-background`,
          "scroll-smooth"
        )}
      >
        <TanStackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </AuthProvider>
            <Toaster position="top-center" />
          </ThemeProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
