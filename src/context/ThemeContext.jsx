import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const accentColors = {
  blue: "37 99 235",
  purple: "139 92 246",
  green: "34 197 94",
  orange: "249 115 22",
  red: "239 68 68",
  pink: "236 72 153",
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("droply-theme") || "system"
  );

  const [accent, setAccent] = useState(
    localStorage.getItem("droply-accent") || "blue"
  );

  const [customColor, setCustomColor] = useState(
    localStorage.getItem("droply-custom-color") || "#2563eb"
  );

  // Theme
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        root.classList.toggle("dark", systemDark);
      }
    };

    applyTheme();

    localStorage.setItem("droply-theme", theme);
  }, [theme]);

  // Accent color
  useEffect(() => {
    let color;

    if (accent === "custom") {
      color = hexToRgb(customColor);
    } else {
      color = accentColors[accent];
    }

    document.documentElement.style.setProperty(
      "--primary",
      color
    );

    localStorage.setItem("droply-accent", accent);
    localStorage.setItem("droply-custom-color", customColor);
  }, [accent, customColor]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accent,
        setAccent,
        customColor,
        setCustomColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");

  const bigint = parseInt(cleanHex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r} ${g} ${b}`;
}

export function useTheme() {
  return useContext(ThemeContext);
}