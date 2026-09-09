import type {
  MoodDefinition,
  MoodId,
  MoodPackDefinition,
  MoodPackId,
} from "@/features/mood/mood.types";
import { defaultMoodPack } from "@/features/mood/packs/defaultMoodPack";
import { catMoodPack } from "@/features/mood/packs/catMoodPack";

export const ACTIVE_MOOD_PACK_ID: MoodPackId = "default";

export const moodPackRegistry: Readonly<
  Record<MoodPackId, MoodPackDefinition>
> = {
  default: defaultMoodPack,
  cat: catMoodPack,
};

export function resolveMoodPack(
  moodPackId: string | null | undefined,
): MoodPackDefinition {
  return Object.values(moodPackRegistry).find((pack) => pack.id === moodPackId) ?? defaultMoodPack;
}

export function resolveMood(
  moodId: MoodId,
  moodPackId: string | null | undefined = ACTIVE_MOOD_PACK_ID,
): MoodDefinition {
  const fallback = defaultMoodPack.moods[moodId];
  if (!fallback) throw new Error(`Default Mood Pack is missing ${moodId}`);
  return resolveMoodPack(moodPackId).moods[moodId] ?? fallback;
}
