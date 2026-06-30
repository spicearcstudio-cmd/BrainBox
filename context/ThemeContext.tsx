import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { AppTheme, ALL_THEMES, SEASONAL_THEMES, DEFAULT_THEME, DARK_THEME } from '../constants/colors';
import { loadData, saveData } from '../services/storage';

interface ThemeCtx {
  theme: AppTheme;
  themeId: string;
  setThemeId: (id: string) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: DEFAULT_THEME,
  themeId: 'default',
  setThemeId: () => {},
});

const ALL_AVAILABLE = [...ALL_THEMES, ...SEASONAL_THEMES];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeId, setThemeIdState] = useState('default');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadData('themeId').then(id => {
      if (id) setThemeIdState(id);
      setLoaded(true);
    });
  }, []);

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id);
    saveData('themeId', id);
  }, []);

  let theme = ALL_AVAILABLE.find(t => t.id === themeId) ?? DEFAULT_THEME;

  // Auto dark mode: if user hasn't explicitly chosen a theme and system is dark
  if (loaded && themeId === 'default' && systemScheme === 'dark') {
    theme = DARK_THEME;
  }

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
