import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { ActivityIndicator, Platform, View } from "react-native";

import { DIARY_DATABASE_NAME } from "@/database/database.constants";
import { migrateDatabase } from "@/database/migrateDatabase";
import { skyTheme } from "@/features/theme/themes/sky";

function DatabaseLoadingFallback() {
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: skyTheme.colors.background,
        flex: 1,
        gap: skyTheme.spacing.sm,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color={skyTheme.colors.primary} />
    </View>
  );
}

export function DatabaseProvider({ children }: PropsWithChildren) {
  if (Platform.OS === "web") {
    return <>{children}</>;
  }

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
