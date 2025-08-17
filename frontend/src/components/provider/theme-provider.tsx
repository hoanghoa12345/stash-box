import { fontOptions, themeOptions } from '@/utils';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: string;
  setColorScheme: (colorScheme: string) => void;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  colorScheme: 'blue',
  setColorScheme: () => null,
  fontFamily: 'inter',
  setFontFamily: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [colorScheme, setColorScheme] = useState<string>(
    () => (localStorage.getItem('color-scheme') as string) || 'blue',
  );
  const [fontFamily, setFontFamily] = useState<string>(
    () => (localStorage.getItem('font-family') as string) || 'inter',
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);

    const rootStyle = document.querySelector(':root') as HTMLStyleElement;
    // Apply color scheme classes
    const colorSchemePalette = themeOptions.find((t) => t.id === colorScheme);
    rootStyle.style.setProperty(
      '--primary',
      colorSchemePalette?.primary_hsl || '217.2193 91.2195% 59.8039%',
    );
    root.style.setProperty(
      '--secondary',
      colorSchemePalette?.secondary_hsl || '220.0000 14.2857% 95.8824%',
    );
    root.style.setProperty(
      '--accent',
      colorSchemePalette?.accent_hsl || '204.0000 93.7500% 93.7255%',
    );

    // Apply font family classes
    const fontFamilyName = fontOptions.find((f) => f.id === fontFamily);
    root.style.setProperty(
      'font-family',
      `'${fontFamilyName?.name}', sans-serif`,
    );
  }, [theme, colorScheme, fontFamily]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    colorScheme,
    setColorScheme: (colorScheme: string) => {
      localStorage.setItem('color-scheme', colorScheme);
      setColorScheme(colorScheme);
    },
    fontFamily,
    setFontFamily: (fontFamily: string) => {
      localStorage.setItem('font-family', fontFamily);
      setFontFamily(fontFamily);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
