import type { Metadata } from "next";
import CorporateLanding from "@/components/launch/CorporateLanding";
import { corporateContent } from "@/content/corporate";

export const metadata: Metadata = {
  title: corporateContent.metaTitle,
  description: corporateContent.metaDescription,
  robots: { index: false, follow: false },
};

export default function CorporatePage() {
  return <CorporateLanding content={corporateContent} />;
}
