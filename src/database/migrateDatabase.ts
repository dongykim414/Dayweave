import type { SQLiteDatabase } from "expo-sqlite";

import { DIARY_DATABASE_VERSION } from "@/database/database.constants";

interface UserVersionRow {
  user_version: number;
}

export async function migrateDatabase(
  database: SQLiteDatabase,
): Promise<void> {
  await database.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

  const versionRow = await database.getFirstAsync<UserVersionRow>(
    "PRAGMA user_version",
  );
  let currentVersion = versionRow?.user_version ?? 0;

  if (currentVersion > DIARY_DATABASE_VERSION) {
    throw new Error(
      `Database version ${currentVersion} is newer than supported version ${DIARY_DATABASE_VERSION}`,
    );
  }

  if (currentVersion === 0) {
    await database.withTransactionAsync(async () => {
      await database.execAsync(`
        CREATE TABLE diary_entries (
          id TEXT PRIMARY KEY NOT NULL,
          entry_date TEXT NOT NULL UNIQUE,
          mood_id TEXT CHECK (
            mood_id IS NULL OR mood_id IN ('happy', 'calm', 'neutral', 'sad', 'stressed')
          ),
          short_text TEXT NOT NULL DEFAULT '',
          content TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);
      await database.execAsync("PRAGMA user_version = 1");
    });
    currentVersion = 1;
  }

  if (currentVersion === 1) {
    await database.withTransactionAsync(async () => {
      await database.execAsync(`
        CREATE TABLE diary_photos (
          id TEXT PRIMARY KEY NOT NULL,
          diary_entry_id TEXT NOT NULL UNIQUE,
          local_uri TEXT NOT NULL,
          width INTEGER NOT NULL,
          height INTEGER NOT NULL,
          created_at TEXT NOT NULL,
          FOREIGN KEY (diary_entry_id)
            REFERENCES diary_entries(id)
            ON DELETE CASCADE
        );
      `);
      await database.execAsync("PRAGMA user_version = 2");
    });
    currentVersion = 2;
  }

  if (currentVersion === 2) {
    await database.withTransactionAsync(async () => {
      await database.execAsync(`
        CREATE TABLE avatar_config (
          singleton_key TEXT PRIMARY KEY NOT NULL CHECK (singleton_key = 'current'),
          body_id TEXT NOT NULL,
          hair_id TEXT NOT NULL,
          top_id TEXT NOT NULL,
          bottom_id TEXT NOT NULL,
          accessory_id TEXT,
          updated_at TEXT NOT NULL
        );
      `);
      await database.execAsync("PRAGMA user_version = 3");
    });
    currentVersion = 3;
  }

  if (currentVersion === 3) {
    await database.withTransactionAsync(async () => {
      await database.execAsync(`
        CREATE TABLE personalization_settings (
          singleton_key TEXT PRIMARY KEY NOT NULL CHECK (singleton_key = 'current'),
          selected_theme_id TEXT NOT NULL,
          selected_mood_pack_id TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);
      await database.execAsync("PRAGMA user_version = 4");
    });
  }
}
