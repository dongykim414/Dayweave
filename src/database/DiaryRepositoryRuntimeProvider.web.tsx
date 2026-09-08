import type { PropsWithChildren } from "react";
import { useMemo } from "react";

import { DiaryRepositoryProvider } from "@/database/DiaryRepositoryContext";
import { LocalStorageDiaryRepository } from "@/features/diary/data/LocalStorageDiaryRepository";

export function DiaryRepositoryRuntimeProvider({
  children,
}: PropsWithChildren) {
  const repository = useMemo(() => new LocalStorageDiaryRepository(), []);

  return (
    <DiaryRepositoryProvider value={repository}>
      {children}
    </DiaryRepositoryProvider>
  );
}
