"use client";

import { useState } from "react";
import ThemeShell from "@/components/ThemeShell";
import EnrollModal from "@/components/EnrollModal";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import ProofSection from "@/components/launch/ProofSection";
import ExpertsSection from "@/components/launch/ExpertsSection";
import CurriculumTrack from "@/components/launch/CurriculumTrack";
import ActivityToasts from "@/components/launch/ActivityToasts";
import { useOfferZone } from "@/components/launch/useOfferZone";
import HeroCollege from "./HeroCollege";
import PainDusk from "./PainDusk";
import SunriseScene from "./SunriseScene";
import BenefitsSunset from "./BenefitsSunset";
import FinalSunset from "./FinalSunset";
import ScrollXP from "./ScrollXP";
import StickyEnroll from "./StickyEnroll";
import { SHOW_SAMPLES } from "@/content/corporate-launch";
import { demoActivity, proof } from "@/content/college-launch";
import { startEnroll } from "@/lib/startEnroll";
import type { AudienceContent } from "@/content/types";

export default function CollegeLanding({ content }: { content: AudienceContent }) {
  const [enrollOpen, setEnrollOpen] = useState(false);
  const openEnroll = () => startEnroll(content, () => setEnrollOpen(true));
  const zone = useOfferZone();
  const faqContent = { ...content, faq: content.faq.slice(0, 4) };

  return (
    <ThemeShell theme="sunset">
      <ScrollXP showChip={zone !== "hero"} />
      <main className="flex-1" data-zone={zone}>
        <HeroCollege pricing={content.pricing} onEnroll={openEnroll} />
        <PainDusk />
        <SunriseScene />
        <BenefitsSunset />
        <ProofSection eyebrow={proof.eyebrow} heading={proof.heading} testimonials={proof.testimonials} />
        <ExpertsSection faculty={content.faculty} variant="sunset" />
        <CurriculumTrack variant="sunset" />
        <div data-offer-zone="faq">
          <FAQ content={faqContent} />
        </div>
        <FinalSunset content={content} onEnroll={openEnroll} />
      </main>
      <Footer />

      <StickyEnroll pricing={content.pricing} onEnroll={openEnroll} hidden={enrollOpen} />
      <ActivityToasts
        events={demoActivity}
        enabled={SHOW_SAMPLES}
        raised={false}
        paused={enrollOpen}
      />

      <EnrollModal
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        audience={content.audience}
        pricing={content.pricing}
        courseName={content.metaTitle}
      />
    </ThemeShell>
  );
}
