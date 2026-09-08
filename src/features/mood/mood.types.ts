export const MOOD_IDS = [
  "happy",
  "calm",
  "neutral",
  "sad",
  "stressed",
] as const;

export type MoodId = (typeof MOOD_IDS)[number];
