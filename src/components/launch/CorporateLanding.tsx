"use client";

import { useState } from "react";
import ThemeShell from "@/components/ThemeShell";
import EnrollModal from "@/components/EnrollModal";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import HeroLaunch from "./HeroLaunch";
import PainSection from "./PainSection";
import TransformScene from "./TransformScene";
import BenefitsSection from "./BenefitsSection";
import ProofSection from "./ProofSection";
import ExpertsSection from "./ExpertsSection";
import CurriculumTrack from "./CurriculumTrack";
import FinalOffer from "./FinalOffer";
import OfferDock from "./OfferDock";
import ActivityToasts from "./ActivityToasts";
import { useIsMobile, useOfferZone } from "./useOfferZone";
import { SHOW_SAMPLES, demoActivity, proof } from "@/content/corporate-launch";
import { startEnroll } from "@/lib/startEnroll";
import type { AudienceContent } from "@/content/types";

export default function CorporateLanding({ content }: { content: AudienceContent }) {
  const [enrollOpen, setEnrollOpen] = useState(false);
  const openEnroll = () => startEnroll(content, () => setEnrollOpen(true));
  const zone = useOfferZone();
  const mobile = useIsMobile();
  const faqContent = { ...content, faq: content.faq.slice(0, 4) };

  return (
    <ThemeShell theme="launch">
      <main className="flex-1" data-zone={zone}>
        <HeroLaunch pricing={content.pricing} onEnroll={openEnroll} />
        <PainSection />
        <TransformScene />
        <BenefitsSection />
        <ProofSection eyebrow={proof.eyebrow} heading={proof.heading} testimonials={proof.testimonials} />
        <ExpertsSection faculty={content.faculty} />
        <CurriculumTrack />
        <div data-offer-zone="faq">
          <FAQ content={faqContent} />
        </div>
        <FinalOffer content={content} onEnroll={openEnroll} />
      </main>
      <Footer />

      <OfferDock zone={zone} pricing={content.pricing} onEnroll={openEnroll} hidden={enrollOpen} mobile={mobile} />
      <ActivityToasts
        events={demoActivity}
        enabled={SHOW_SAMPLES}
        raised={!mobile && (zone === "benefits" || zone === "faq")}
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
