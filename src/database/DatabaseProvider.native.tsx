import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { ActivityIndicator, View } from "react-native";

import { DIARY_DATABASE_NAME } from "@/database/database.constants";
import { migrateDatabase } from "@/database/migrateDatabase";
import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components";

function DatabaseLoadingFallback() {
  const { theme } = useTheme();

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: theme.colors.background,
        flex: 1,
        gap: theme.spacing.sm,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color={theme.colors.primary} />
      <AppText color="textSecondary">기록을 준비하고 있어요.</AppText>
    </View>
  );
}

export function DatabaseProvider({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<DatabaseLoadingFallback />}>
      <SQLiteProvider
        databaseName={DIARY_DATABASE_NAME}
        onInit={migrateDatabase}
        useSuspense
      >
        {children}
      </SQLiteProvider>
    </Suspense>
  );
}
