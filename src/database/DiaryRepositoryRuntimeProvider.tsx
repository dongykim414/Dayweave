import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { DiaryRepositoryProvider } from "@/database/DiaryRepositoryContext";
import { SQLiteDiaryRepository } from "@/features/diary/data/SQLiteDiaryRepository";

export function DiaryRepositoryRuntimeProvider({
  children,
}: PropsWithChildren) {
  const database = useSQLiteContext();
  const repository = useMemo(
    () => new SQLiteDiaryRepository(database),
    [database],
  );

  return (
    <DiaryRepositoryProvider value={repository}>
      {children}
    </DiaryRepositoryProvider>
  );
}
