import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>DAYWEAVE</Text>
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>하루를 엮는 일정 앱</Text>
          <Text style={styles.description}>
            일·주·월 일정과 Todo를 관리하는 모바일 다이어리를 준비하고 있습니다.
          </Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>현재 단계</Text>
          <Text style={styles.statusText}>Expo 기본 설정 완료</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F4EF",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#1E4D3A",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  copy: {
    gap: 16,
  },
  title: {
    color: "#17201C",
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  description: {
    maxWidth: 440,
    color: "#59635E",
    fontSize: 17,
    lineHeight: 27,
  },
  statusCard: {
    gap: 6,
    borderColor: "#DEDAD0",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  statusLabel: {
    color: "#7B837F",
    fontSize: 13,
    fontWeight: "600",
  },
  statusText: {
    color: "#1E4D3A",
    fontSize: 18,
    fontWeight: "700",
  },
});
