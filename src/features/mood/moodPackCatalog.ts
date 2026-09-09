import { ACTIVE_MOOD_PACK_ID, resolveMoodPack } from "@/features/mood/moodPackRegistry";
import type { MoodPackId } from "@/features/mood/mood.types";

export interface MoodPackCatalogItem {
  id: MoodPackId;
  displayName: string;
  isDefault: boolean;
}

export const MOOD_PACK_CATALOG: readonly MoodPackCatalogItem[] = [
  { id: "default", displayName: "Default", isDefault: true },
  { id: "cat", displayName: "Cat", isDefault: false },
];

export const DEFAULT_OWNED_MOOD_PACK_IDS: ReadonlySet<MoodPackId> = new Set(
  MOOD_PACK_CATALOG.map((item) => item.id),
);

export function resolveMoodPackId(value: string | null | undefined): MoodPackId {
  return resolveMoodPack(value).id;
}

export function getOwnedMoodPacks(
  ownedIds: ReadonlySet<MoodPackId> = DEFAULT_OWNED_MOOD_PACK_IDS,
): readonly MoodPackCatalogItem[] {
  return MOOD_PACK_CATALOG.filter((item) => ownedIds.has(item.id));
}

export function selectOwnedMoodPack(
  moodPackId: MoodPackId,
  ownedIds: ReadonlySet<MoodPackId> = DEFAULT_OWNED_MOOD_PACK_IDS,
): MoodPackId {
  if (!ownedIds.has(moodPackId)) throw new Error("Only an owned Mood Pack can be selected");
  return moodPackId;
}

export { ACTIVE_MOOD_PACK_ID };
