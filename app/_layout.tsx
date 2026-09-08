import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { DatabaseProvider } from "@/database/DatabaseProvider";
import { AvatarRepositoryRuntimeProvider } from "@/database/AvatarRepositoryRuntimeProvider";
import { DiaryRepositoryRuntimeProvider } from "@/database/DiaryRepositoryRuntimeProvider";
import { ThemeProvider, useTheme } from "@/features/theme";

function RootNavigator() {
  const { theme } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
          headerShown: false,
        }}
      />
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <DiaryRepositoryRuntimeProvider>
          <AvatarRepositoryRuntimeProvider>
            <RootNavigator />
          </AvatarRepositoryRuntimeProvider>
        </DiaryRepositoryRuntimeProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}
