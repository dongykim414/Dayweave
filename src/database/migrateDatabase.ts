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
  const currentVersion = versionRow?.user_version ?? 0;

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
      await database.execAsync(`PRAGMA user_version = ${DIARY_DATABASE_VERSION}`);
    });
  }
}
