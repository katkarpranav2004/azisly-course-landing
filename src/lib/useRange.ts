"use client";

import { transform, useTransform, type MotionValue } from "framer-motion";

// Function-form transforms stay JS-driven: Framer's native scroll-timeline acceleration
// mis-maps multi-stop ranges for opacity/filter, leaving "faded" elements visible.
export function useRange(p: MotionValue<number>, input: number[], output: number[]): MotionValue<number>;
export function useRange(p: MotionValue<number>, input: number[], output: string[]): MotionValue<string>;
export function useRange(
  p: MotionValue<number>,
  input: number[],
  output: number[] | string[]
): MotionValue<number> | MotionValue<string> {
  return useTransform(p, (v) => transform(v, input, output as number[]));
}
