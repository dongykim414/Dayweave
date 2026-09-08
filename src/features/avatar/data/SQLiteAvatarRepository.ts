import type { SQLiteDatabase } from "expo-sqlite";

import {
  toAvatarConfig,
  type AvatarConfigRow,
} from "@/features/avatar/data/avatarConfigMapper";
import type { AvatarConfig } from "@/features/avatar/avatar.types";
import type { AvatarRepository } from "@/features/avatar/repository/AvatarRepository";

export class SQLiteAvatarRepository implements AvatarRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getConfig(): Promise<AvatarConfig | null> {
    const row = await this.database.getFirstAsync<AvatarConfigRow>(
      `SELECT body_id, hair_id, top_id, bottom_id, accessory_id, updated_at
       FROM avatar_config
       WHERE singleton_key = 'current'
       LIMIT 1`,
    );

    return row ? toAvatarConfig(row) : null;
  }

  async saveConfig(config: AvatarConfig): Promise<void> {
    await this.database.runAsync(
      `INSERT INTO avatar_config (
        singleton_key, body_id, hair_id, top_id, bottom_id, accessory_id, updated_at
      ) VALUES ('current', ?, ?, ?, ?, ?, ?)
      ON CONFLICT(singleton_key) DO UPDATE SET
        body_id = excluded.body_id,
        hair_id = excluded.hair_id,
        top_id = excluded.top_id,
        bottom_id = excluded.bottom_id,
        accessory_id = excluded.accessory_id,
        updated_at = excluded.updated_at`,
      config.bodyId,
      config.hairId,
      config.topId,
      config.bottomId,
      config.accessoryId,
      new Date().toISOString(),
    );
  }
}
