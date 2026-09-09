import type { ThemeDefinition } from "@/features/theme/theme.types";

export const nightTheme: ThemeDefinition = {
  id: "night",
  name: "Night",
  statusBarStyle: "light",
  colors: {
    background: "#151A24",
    surface: "#202838",
    surfaceSoft: "#2A3549",
    textPrimary: "#F1F5FA",
    textSecondary: "#AEB9C9",
    primary: "#8DB8E8",
    primarySoft: "#2D4968",
    border: "#39465B",
    danger: "#F0838B",
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
