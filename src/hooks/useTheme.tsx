import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import secureStorage from "@/utils/secureStorage";
import { APP_CONSTANTS } from "@/utils/Constants";

type Theme = typeof APP_CONSTANTS.LIGHT_THEME | typeof APP_CONSTANTS.DARK_THEME;

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getInitialTheme = (): Theme =>
  secureStorage.getItem<Theme>(APP_CONSTANTS.GLOBAL_THEME) ?? APP_CONSTANTS.LIGHT_THEME;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle(APP_CONSTANTS.DARK_THEME, theme === APP_CONSTANTS.DARK_THEME);
    secureStorage.setItem(APP_CONSTANTS.GLOBAL_THEME, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === APP_CONSTANTS.DARK_THEME ? APP_CONSTANTS.LIGHT_THEME : APP_CONSTANTS.DARK_THEME));

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === APP_CONSTANTS.DARK_THEME, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
