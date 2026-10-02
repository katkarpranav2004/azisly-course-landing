import type { Metadata } from "next";
import CourseLanding from "@/components/course/CourseLanding";
import { collegeContent } from "@/content/college";

export const metadata: Metadata = {
  title: collegeContent.metaTitle,
  description: collegeContent.metaDescription,
  robots: { index: false, follow: false },
};

export default function CollegePage() {
  return <CourseLanding content={collegeContent} />;
}