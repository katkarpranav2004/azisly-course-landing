import type { Metadata } from "next";
import CourseLanding from "@/components/course/CourseLanding";
import { courseContent } from "@/content/course";

export const metadata: Metadata = {
  title: courseContent.metaTitle,
  description: courseContent.metaDescription,
};

export default function CourseClassicPage() {
  return <CourseLanding content={courseContent} look="classic" />;
}
