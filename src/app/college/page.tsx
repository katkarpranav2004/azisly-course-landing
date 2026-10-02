import type { Metadata } from "next";
import CollegeLanding from "@/components/college/CollegeLanding";
import { collegeContent } from "@/content/college";

export const metadata: Metadata = {
  title: collegeContent.metaTitle,
  description: collegeContent.metaDescription,
};

export default function CollegePage() {
  return <CollegeLanding content={collegeContent} />;
}
