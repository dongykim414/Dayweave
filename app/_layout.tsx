import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { PropsWithChildren } from "react";

import { DatabaseProvider } from "@/database/DatabaseProvider";
import { AvatarRepositoryRuntimeProvider } from "@/database/AvatarRepositoryRuntimeProvider";
import { DiaryRepositoryRuntimeProvider } from "@/database/DiaryRepositoryRuntimeProvider";
import { PersonalizationRepositoryRuntimeProvider } from "@/database/PersonalizationRepositoryRuntimeProvider";
import { MoodPackProvider } from "@/features/mood/MoodPackProvider";
import { PersonalizationProvider, usePersonalization } from "@/features/personalization/PersonalizationProvider";
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
      <StatusBar style={theme.statusBarStyle} />
    </>
  );
}

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <PersonalizationRepositoryRuntimeProvider>
        <PersonalizationProvider>
          <PersonalizationRuntime>
            <DiaryRepositoryRuntimeProvider>
              <AvatarRepositoryRuntimeProvider>
                <RootNavigator />
              </AvatarRepositoryRuntimeProvider>
            </DiaryRepositoryRuntimeProvider>
          </PersonalizationRuntime>
        </PersonalizationProvider>
      </PersonalizationRepositoryRuntimeProvider>
    </DatabaseProvider>
  );
}

function PersonalizationRuntime({ children }: PropsWithChildren) {
  const { settings } = usePersonalization();
  return (
    <ThemeProvider themeId={settings.selectedThemeId}>
      <MoodPackProvider moodPackId={settings.selectedMoodPackId}>
        {children}
      </MoodPackProvider>
    </ThemeProvider>
  );
}
