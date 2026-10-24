import type { Metadata } from "next";
import CourseLanding from "@/components/course/CourseLanding";
import { courseContent } from "@/content/course";

export const metadata: Metadata = {
  title: courseContent.metaTitle,
  description: courseContent.metaDescription,
};

/** The combined landing page: the corporate design, with a section for why the course fits students and professionals. */
export default function Home() {
  return <CourseLanding content={courseContent} combined />;
}
