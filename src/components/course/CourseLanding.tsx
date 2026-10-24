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
import AudienceSplit from "./AudienceSplit";
import ActivityToasts from "@/components/launch/ActivityToasts";
import { SHOW_SAMPLES, demoActivity as corporateActivity } from "@/content/corporate-launch";
import { demoActivity as collegeActivity } from "@/content/college-launch";
import { STUDIO_COPY } from "@/content/studio";
import { StudioProvider } from "./StudioContext";
import { startEnroll } from "@/lib/startEnroll";
import { collegeContent } from "@/content/college";
import { corporateContent } from "@/content/corporate";
import type { AudienceContent } from "@/content/types";

/**
 * The "studio" landing design. Words and pricing come from the audience's content and STUDIO_COPY.
 * With `combined`, one page serves students and working professionals: the Enroll buttons scroll to the
 * "who is this for" section, and each audience card (and the pricing panel) opens that audience's own payment form.
 */
export default function CourseLanding({ content, combined = false }: { content: AudienceContent; combined?: boolean }) {
  const [enrollOpen, setEnrollOpen] = useState(false);
  const enrollAs = (audience: "college" | "corporate") =>
    startEnroll(audience === "college" ? collegeContent : corporateContent, () => setEnrollOpen(true));
  const openEnroll = () => {
    if (combined) {
      document.getElementById("who")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    startEnroll(content, () => setEnrollOpen(true));
  };
  const faq = STUDIO_COPY[content.audience].faq;
  const activity = content.audience === "college" ? collegeActivity : corporateActivity;

  return (
    <StudioProvider content={content}>
      <ThemeShell theme="studio">
        <main className="flex-1">
          <HeroStudio content={content} onEnroll={openEnroll} />
          <CredentialStrip />
          {combined && <AudienceSplit onEnroll={enrollAs} />}
          <PainSolutions />
          <WhyThis />
          <TestimonialWall />
          <MentorsModules content={content} />
          <Plan content={content} onEnroll={openEnroll} onEnrollAs={combined ? enrollAs : undefined} />
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
