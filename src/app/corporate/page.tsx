import type { Metadata } from "next";
import CourseLanding from "@/components/course/CourseLanding";
import { corporateContent } from "@/content/corporate";

export const metadata: Metadata = {
  title: corporateContent.metaTitle,
  description: corporateContent.metaDescription,
};

export default function CorporatePage() {
  return <CourseLanding content={corporateContent} />;
}