import { resolvePersonalizationSettings } from "@/features/personalization/personalizationSelection";
import type { PersonalizationSettings } from "@/features/personalization/personalization.types";

export interface PersonalizationSettingsRow {
  selected_theme_id: string;
  selected_mood_pack_id: string;
  updated_at: string;
}

export function toPersonalizationSettings(
  row: PersonalizationSettingsRow,
): PersonalizationSettings {
  return resolvePersonalizationSettings({
    selectedThemeId: row.selected_theme_id,
    selectedMoodPackId: row.selected_mood_pack_id,
  });
}
