import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL =
    process.env.NEXT_PUBLIC_APP_URL || "https://fe-gunasmash.vercel.app/";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/member/", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
