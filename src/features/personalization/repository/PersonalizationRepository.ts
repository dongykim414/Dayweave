import type { PersonalizationSettings } from "@/features/personalization/personalization.types";

export interface PersonalizationRepository {
  getSettings(): Promise<PersonalizationSettings | null>;
  saveSettings(settings: PersonalizationSettings): Promise<void>;
}
