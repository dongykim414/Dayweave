import type { MoodPackDefinition } from "@/features/mood/mood.types";

export const defaultMoodPack: MoodPackDefinition = {
  id: "default",
  name: "Default",
  moods: {
    happy: {
      id: "happy",
      label: "행복해요",
      visual: { type: "text", value: "😊" },
    },
    calm: {
      id: "calm",
      label: "평온해요",
      visual: { type: "text", value: "😌" },
    },
    neutral: {
      id: "neutral",
      label: "보통이에요",
      visual: { type: "text", value: "🙂" },
    },
    sad: {
      id: "sad",
      label: "속상해요",
      visual: { type: "text", value: "😢" },
    },
    stressed: {
      id: "stressed",
      label: "힘들어요",
      visual: { type: "text", value: "😵" },
    },
  },
};
