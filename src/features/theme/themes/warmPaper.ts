import type { ThemeDefinition } from "@/features/theme/theme.types";

export const warmPaperTheme: ThemeDefinition = {
  id: "warm-paper",
  name: "Warm Paper",
  statusBarStyle: "dark",
  colors: {
    background: "#FAF5EB",
    surface: "#FFFDF8",
    surfaceSoft: "#F2E6D2",
    textPrimary: "#3D3028",
    textSecondary: "#78685D",
    primary: "#A66A45",
    primarySoft: "#F1D8C2",
    border: "#E7D8C5",
    danger: "#B84C55",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 14, lg: 22, full: 999 },
  typography: {
    title: { fontSize: 32, lineHeight: 40, fontWeight: "700", letterSpacing: -0.8 },
    heading: { fontSize: 22, lineHeight: 30, fontWeight: "700", letterSpacing: -0.3 },
    body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
    label: { fontSize: 15, lineHeight: 20, fontWeight: "600" },
    caption: { fontSize: 12, lineHeight: 18, fontWeight: "500" },
  },
};
