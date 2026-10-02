"use client";

import { useState } from "react";
import ThemeShell from "@/components/ThemeShell";
import EnrollModal from "@/components/EnrollModal";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import CourseHero from "./CourseHero";
import HeroStudio from "./HeroStudio";
import Leverage from "./Leverage";
import CurriculumBreakdown from "./CurriculumBreakdown";
import Learners from "./Learners";
import AboutInstructor from "./AboutInstructor";
import Plan from "./Plan";
import PromiseStrip from "./PromiseStrip";
import StickyBar from "./StickyBar";
import PainSolutions from "./PainSolutions";
import TestimonialWall from "./TestimonialWall";
import MentorsModules from "./MentorsModules";
import CredentialStrip from "./CredentialStrip";
import WhyThis from "./WhyThis";
import NextSteps from "./NextSteps";
import ActivityToasts from "@/components/launch/ActivityToasts";
import { SHOW_SAMPLES, demoActivity as corporateActivity } from "@/content/corporate-launch";
import { demoActivity as collegeActivity } from "@/content/college-launch";
import { STUDIO_COPY } from "@/content/studio";
import { StudioProvider } from "./StudioContext";
import { startEnroll } from "@/lib/startEnroll";
import type { AudienceContent } from "@/content/types";

export default function CourseLanding({
  content,
  look = "studio",
}: {
  content: AudienceContent;
  look?: "studio" | "classic";
}) {
  const [enrollOpen, setEnrollOpen] = useState(false);
  const openEnroll = () => startEnroll(content, () => setEnrollOpen(true));
  // The studio design reads its words from the audience's copy; the classic look keeps the content's own FAQ.
  const faq = look === "studio" ? STUDIO_COPY[content.audience].faq : content.faq;
  const activity = content.audience === "college" ? collegeActivity : corporateActivity;

  return (
    <StudioProvider content={content}>
    <ThemeShell theme={look}>
      <main className="flex-1">
        {look === "studio" ? (
          <>
            <HeroStudio content={content} onEnroll={openEnroll} />
            <CredentialStrip />
            <PainSolutions />
            <WhyThis />
            <TestimonialWall />
            <MentorsModules content={content} />
            <Plan content={content} onEnroll={openEnroll} />
            <NextSteps />
          </>
        ) : (
          <>
            <CourseHero content={content} onEnroll={openEnroll} />
            <Leverage />
            <CurriculumBreakdown content={content} onEnroll={openEnroll} />
            <Learners />
            <AboutInstructor faculty={content.faculty} />
            <Plan content={content} onEnroll={openEnroll} />
            <PromiseStrip />
          </>
        )}
        <div id="faq" className="scroll-mt-6">
          <FAQ content={{ ...content, faq }} />
        </div>
      </main>
      <Footer />

      {/* The studio look keeps its CTA in the sticky top bar instead (CRO brief: top right). */}
      {look === "classic" && <StickyBar pricing={content.pricing} onEnroll={openEnroll} hidden={enrollOpen} />}

      {/* Placeholder enrollments render in development only (SHOW_SAMPLES); feed real ones before launch. */}
      <ActivityToasts events={activity} enabled={SHOW_SAMPLES} raised={look === "classic"} paused={enrollOpen} mobile="bottom" />

      <EnrollModal
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        audience={content.audience}
        pricing={content.pricing}
        courseName={content.metaTitle}
      />
    </ThemeShell>
    </StudioProvider>
  );
}
