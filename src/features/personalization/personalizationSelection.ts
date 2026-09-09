import {
  DEFAULT_OWNED_MOOD_PACK_IDS,
  resolveMoodPackId,
  selectOwnedMoodPack,
} from "@/features/mood/moodPackCatalog";
import type { MoodPackId } from "@/features/mood/mood.types";
import type {
  PersonalizationSettings,
  PersonalizationSettingsCandidate,
} from "@/features/personalization/personalization.types";
import {
  DEFAULT_OWNED_THEME_IDS,
  resolveThemeId,
  selectOwnedTheme,
} from "@/features/theme";
import type { ThemeId } from "@/features/theme";

export const DEFAULT_PERSONALIZATION_SETTINGS: PersonalizationSettings = {
  selectedThemeId: "sky",
  selectedMoodPackId: "default",
};

export function resolvePersonalizationSettings(
  candidate: PersonalizationSettingsCandidate | null,
): PersonalizationSettings {
  return {
    selectedThemeId: resolveThemeId(candidate?.selectedThemeId),
    selectedMoodPackId: resolveMoodPackId(candidate?.selectedMoodPackId),
  };
}

export function selectTheme(
  settings: PersonalizationSettings,
  themeId: ThemeId,
): PersonalizationSettings {
  return {
    ...settings,
    selectedThemeId: selectOwnedTheme(themeId, DEFAULT_OWNED_THEME_IDS),
  };
}

export function selectMoodPack(
  settings: PersonalizationSettings,
  moodPackId: MoodPackId,
): PersonalizationSettings {
  return {
    ...settings,
    selectedMoodPackId: selectOwnedMoodPack(
      moodPackId,
      DEFAULT_OWNED_MOOD_PACK_IDS,
    ),
  };
}
