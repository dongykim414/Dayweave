import type {
  MoodDefinition,
  MoodId,
  MoodPackDefinition,
  MoodPackId,
} from "@/features/mood/mood.types";
import { defaultMoodPack } from "@/features/mood/packs/defaultMoodPack";

export const ACTIVE_MOOD_PACK_ID: MoodPackId = "default";

export const moodPackRegistry: Readonly<
  Record<MoodPackId, MoodPackDefinition>
> = {
  default: defaultMoodPack,
};

export function resolveMoodPack(moodPackId: MoodPackId): MoodPackDefinition {
  return moodPackRegistry[moodPackId];
}

export function resolveMood(
  moodId: MoodId,
  moodPackId: MoodPackId = ACTIVE_MOOD_PACK_ID,
): MoodDefinition {
  return resolveMoodPack(moodPackId).moods[moodId];
}
