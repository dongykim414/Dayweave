import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

import type { DiaryRepository } from "@/features/diary/repository/DiaryRepository";

const DiaryRepositoryContext = createContext<DiaryRepository | null>(null);

export function DiaryRepositoryProvider({
  children,
  value,
}: PropsWithChildren<{ value: DiaryRepository }>) {
  return (
    <DiaryRepositoryContext.Provider value={value}>
      {children}
    </DiaryRepositoryContext.Provider>
  );
}

export function useDiaryRepository(): DiaryRepository {
  const repository = useContext(DiaryRepositoryContext);

  if (!repository) {
    throw new Error(
      "useDiaryRepository must be used within a DiaryRepositoryProvider",
    );
  }

  return repository;
}
