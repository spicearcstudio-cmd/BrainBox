import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppTheme, ALL_THEMES, DEFAULT_THEME } from '../constants/colors';
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState('default');

  useEffect(() => {
    loadData('themeId').then(id => { if (id) setThemeIdState(id); });
  }, []);

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id);
    saveData('themeId', id);
  }, []);

  const theme = ALL_THEMES.find(t => t.id === themeId) ?? DEFAULT_THEME;

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
