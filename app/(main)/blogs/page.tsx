import { BlogsView } from "@/components/main/blogs/blogs-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Blog",
  description:
    "Read tips, tutorials, gear reviews, match recaps, and stories from the GunaSmash Badminton Club writers.",
  keywords: [
    "Badminton Tips",
    "Gear Review",
    "Badminton Tutorials",
    "Sports Blog",
  ],
};

export default function BlogsPage() {
  return <BlogsView />;
}
