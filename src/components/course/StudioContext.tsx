"use client";

import { createContext, useContext, type ReactNode } from "react";
import { STUDIO_COPY, type StudioCopy } from "@/content/studio";
import { courseContent } from "@/content/course";
import type { AudienceContent } from "@/content/types";

type Studio = { copy: StudioCopy; content: AudienceContent };

const Ctx = createContext<Studio>({ copy: STUDIO_COPY.course, content: courseContent });

/** Supplies the audience's copy and pricing to every studio section below it. */
export function StudioProvider({ content, children }: { content: AudienceContent; children: ReactNode }) {
  return <Ctx.Provider value={{ copy: STUDIO_COPY[content.audience], content }}>{children}</Ctx.Provider>;
}

export const useStudio = () => useContext(Ctx);
