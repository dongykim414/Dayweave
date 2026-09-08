import type { ImageSourcePropType } from "react-native";

export const MOOD_IDS = [
  "happy",
  "calm",
  "neutral",
  "sad",
  "stressed",
] as const;

export type MoodId = (typeof MOOD_IDS)[number];

export type MoodPackId = "default";

export type MoodVisual =
  | { type: "text"; value: string }
  | { type: "image"; source: ImageSourcePropType };

export interface MoodDefinition {
  id: MoodId;
  label: string;
  visual: MoodVisual;
}

export interface MoodPackDefinition {
  id: MoodPackId;
  name: string;
  moods: Readonly<Record<MoodId, MoodDefinition>>;
}

export function isMoodId(value: string): value is MoodId {
  return MOOD_IDS.some((moodId) => moodId === value);
}
