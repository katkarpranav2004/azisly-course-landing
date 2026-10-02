"use client";

import { useState } from "react";
import ThemeShell from "@/components/ThemeShell";
import EnrollModal from "@/components/EnrollModal";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import HeroStudio from "./HeroStudio";
import Plan from "./Plan";
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

/** The "studio" landing design. Words and pricing come from the audience's content and STUDIO_COPY. */
export default function CourseLanding({ content }: { content: AudienceContent }) {
  const [enrollOpen, setEnrollOpen] = useState(false);
  const openEnroll = () => startEnroll(content, () => setEnrollOpen(true));
  const faq = STUDIO_COPY[content.audience].faq;
  const activity = content.audience === "college" ? collegeActivity : corporateActivity;

  return (
    <StudioProvider content={content}>
      <ThemeShell theme="studio">
        <main className="flex-1">
          <HeroStudio content={content} onEnroll={openEnroll} />
          <CredentialStrip />
          <PainSolutions />
          <WhyThis />
          <TestimonialWall />
          <MentorsModules content={content} />
          <Plan content={content} onEnroll={openEnroll} />
          <NextSteps />
          <div id="faq" className="scroll-mt-6">
            <FAQ content={{ ...content, faq }} />
          </div>
        </main>
        <Footer />

        {/* Placeholder enrollments render in development only; feed real ones before launch. */}
        <ActivityToasts events={activity} enabled={SHOW_SAMPLES} raised={false} paused={enrollOpen} mobile="bottom" />

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
