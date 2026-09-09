import type { MoodPackDefinition } from "@/features/mood/mood.types";

export const catMoodPack: MoodPackDefinition = {
  id: "cat",
  name: "Cat",
  moods: {
    happy: { id: "happy", label: "신난 고양이", visual: { type: "text", value: "😸" } },
    calm: { id: "calm", label: "느긋한 고양이", visual: { type: "text", value: "😺" } },
    neutral: { id: "neutral", label: "무심한 고양이", visual: { type: "text", value: "😼" } },
    sad: { id: "sad", label: "속상한 고양이", visual: { type: "text", value: "😿" } },
    stressed: { id: "stressed", label: "지친 고양이", visual: { type: "text", value: "🙀" } },
  },
};
