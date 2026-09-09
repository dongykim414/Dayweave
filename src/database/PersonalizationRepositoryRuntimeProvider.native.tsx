import { useMemo } from "react";
import type { PropsWithChildren } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { PersonalizationRepositoryProvider } from "@/database/PersonalizationRepositoryContext";
import { SQLitePersonalizationRepository } from "@/features/personalization/data/SQLitePersonalizationRepository";

export function PersonalizationRepositoryRuntimeProvider({ children }: PropsWithChildren) {
  const database = useSQLiteContext();
  const repository = useMemo(
    () => new SQLitePersonalizationRepository(database),
    [database],
  );
  return (
    <PersonalizationRepositoryProvider value={repository}>
      {children}
    </PersonalizationRepositoryProvider>
  );
}
