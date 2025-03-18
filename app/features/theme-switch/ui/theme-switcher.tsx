import React from "react";
import { useTheme } from "@/shared/theme";
import { Switch } from "@heroui/switch";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      checked={theme === "dark"}
      onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
};
