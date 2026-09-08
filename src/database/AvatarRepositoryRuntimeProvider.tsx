import { useMemo } from "react";
import type { PropsWithChildren } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { AvatarRepositoryProvider } from "@/database/AvatarRepositoryContext";
import { SQLiteAvatarRepository } from "@/features/avatar/data/SQLiteAvatarRepository";

export function AvatarRepositoryRuntimeProvider({ children }: PropsWithChildren) {
  const database = useSQLiteContext();
  const repository = useMemo(() => new SQLiteAvatarRepository(database), [database]);

  return (
    <AvatarRepositoryProvider value={repository}>
      {children}
    </AvatarRepositoryProvider>
  );
}
