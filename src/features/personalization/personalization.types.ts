import type { MoodPackId } from "@/features/mood/mood.types";
import type { ThemeId } from "@/features/theme";

export interface PersonalizationSettings {
  selectedThemeId: ThemeId;
  selectedMoodPackId: MoodPackId;
}

export interface PersonalizationSettingsCandidate {
  selectedThemeId?: string | null;
  selectedMoodPackId?: string | null;
}
