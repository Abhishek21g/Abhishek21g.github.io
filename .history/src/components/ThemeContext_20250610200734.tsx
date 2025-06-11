import React, { createContext, useContext, useEffect, useState } from 'react';

// Define available themes
export const THEMES = [
  'happy', // bright, playful
  'chill', // cool, smooth
  'night', // dark, relaxed
  'professional', // clean, OSU
  'surprise', // random
] as const;

type Theme = typeof THEMES[number];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function detectInitialTheme(): Theme {
  // Time-based
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'happy';
  if (hour >= 12 && hour < 18) return 'professional';
  if (hour >= 18 || hour < 6) return 'night';

  // Fallback
  return 'chill';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(detectInitialTheme());

  // Optionally, detect referrer or device here for more logic
  useEffect(() => {
    // Example: If referrer is LinkedIn, set professional
    if (document.referrer.includes('linkedin.com')) setTheme('professional');
    // Example: If user is on mobile, set chill
    if (/Mobi|Android/i.test(navigator.userAgent)) setTheme('chill');
  }, []);

  // Cycle through themes for demo/user override
  const cycleTheme = () => {
    setTheme((prev) => {
      const idx = THEMES.indexOf(prev);
      return THEMES[(idx + 1) % THEMES.length];
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
} 