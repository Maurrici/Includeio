import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AccessibilityContextType {
  theme: Theme;
  fontSize: FontSize;
  highContrast: boolean;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setHighContrast: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('inclusio-theme');
    return (saved as Theme) || 'light';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('inclusio-font-size');
    return (saved as FontSize) || 'medium';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const saved = localStorage.getItem('inclusio-high-contrast');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('inclusio-theme', theme);
    localStorage.setItem('inclusio-font-size', fontSize);
    localStorage.setItem('inclusio-high-contrast', String(highContrast));

    const root = document.documentElement;
    
    // Theme
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
    root.classList.add(`font-size-${fontSize}`);
  }, [theme, fontSize, highContrast]);

  return (
    <AccessibilityContext.Provider value={{ theme, fontSize, highContrast, setTheme, setFontSize, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
