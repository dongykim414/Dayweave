import type { SQLiteDatabase } from "expo-sqlite";

import {
  toPersonalizationSettings,
  type PersonalizationSettingsRow,
} from "@/features/personalization/data/personalizationMapper";
import type { PersonalizationRepository } from "@/features/personalization/repository/PersonalizationRepository";
import type { PersonalizationSettings } from "@/features/personalization/personalization.types";

export class SQLitePersonalizationRepository implements PersonalizationRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getSettings(): Promise<PersonalizationSettings | null> {
    const row = await this.database.getFirstAsync<PersonalizationSettingsRow>(
      `SELECT selected_theme_id, selected_mood_pack_id, updated_at
       FROM personalization_settings
       WHERE singleton_key = 'current'
       LIMIT 1`,
    );
    return row ? toPersonalizationSettings(row) : null;
  }

  async saveSettings(settings: PersonalizationSettings): Promise<void> {
    await this.database.runAsync(
      `INSERT INTO personalization_settings (
        singleton_key, selected_theme_id, selected_mood_pack_id, updated_at
      ) VALUES ('current', ?, ?, ?)
      ON CONFLICT(singleton_key) DO UPDATE SET
        selected_theme_id = excluded.selected_theme_id,
        selected_mood_pack_id = excluded.selected_mood_pack_id,
        updated_at = excluded.updated_at`,
      settings.selectedThemeId,
      settings.selectedMoodPackId,
      new Date().toISOString(),
    );
  }
}
