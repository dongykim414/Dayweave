import { useLocalSearchParams } from "expo-router";

import DiaryDetailScreen from "@/features/diary/screens/DiaryDetailScreen";

export default function DiaryDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const entryId = Array.isArray(id) ? (id[0] ?? null) : (id ?? null);

  return <DiaryDetailScreen id={entryId} />;
}
