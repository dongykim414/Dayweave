import { Image, Pressable, View } from "react-native";

import { useTheme } from "@/features/theme";
import { AppButton, AppCard, AppText, SectionHeader } from "@/shared/components";

interface PhotoPickerFieldProps {
  available: boolean;
  busy: boolean;
  onRemove: () => void;
  onSelect: () => void;
  uri: string | null;
}

export function PhotoPickerField({
  available,
  busy,
  onRemove,
  onSelect,
  uri,
}: PhotoPickerFieldProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <SectionHeader title="사진 추가하기" />

      {uri ? (
        <AppCard style={{ gap: theme.spacing.md, padding: theme.spacing.md }}>
          {available ? (
            <Image
              accessibilityLabel="선택한 일기 사진 미리보기"
              resizeMode="cover"
              source={{ uri }}
              style={{
                aspectRatio: 4 / 3,
                borderRadius: theme.radius.md,
                width: "100%",
              }}
            />
          ) : (
            <View
              style={{
                alignItems: "center",
                aspectRatio: 4 / 3,
                backgroundColor: theme.colors.surfaceSoft,
                borderRadius: theme.radius.md,
                justifyContent: "center",
                padding: theme.spacing.lg,
              }}
            >
              <AppText color="textSecondary">
                저장된 사진 파일을 찾을 수 없어요.
              </AppText>
            </View>
          )}

          <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            <View style={{ flex: 1 }}>
              <AppButton
                disabled={busy}
                label={busy ? "사진 준비 중..." : "사진 교체"}
                onPress={onSelect}
                size="compact"
                variant="secondary"
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton
                disabled={busy}
                label="사진 제거"
                onPress={onRemove}
                size="compact"
                variant="ghost"
              />
            </View>
          </View>
        </AppCard>
      ) : (
        <Pressable
          accessibilityLabel={busy ? "사진 준비 중" : "사진 추가하기"}
          accessibilityRole="button"
          disabled={busy}
          onPress={onSelect}
          style={({ pressed }) => ({
            alignItems: "center",
            alignSelf: "flex-start",
            backgroundColor: theme.colors.surfaceSoft,
            borderColor: theme.colors.primarySoft,
            borderRadius: theme.radius.md,
            borderStyle: "dashed",
            borderWidth: 1,
            height: 88,
            justifyContent: "center",
            opacity: busy ? 0.45 : pressed ? 0.72 : 1,
            width: 88,
          })}
        >
          <AppText color="primary" variant="title">＋</AppText>
        </Pressable>
      )}
    </View>
  );
}
