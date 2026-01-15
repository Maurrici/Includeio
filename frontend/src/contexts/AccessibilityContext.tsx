import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'custom';
type BaseTheme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface CustomColors {
  background?: string;
  primary?: string;
  accent?: string;
  foreground?: string;
}

interface AccessibilityContextType {
  theme: Theme;
  baseTheme: BaseTheme;
  fontSize: FontSize;
  highContrast: boolean;
  customColors: CustomColors;
  setTheme: (theme: Theme) => void;
  setBaseTheme: (theme: BaseTheme) => void;
  setFontSize: (size: FontSize) => void;
  setHighContrast: (enabled: boolean) => void;
  setCustomColors: (colors: CustomColors) => void;
  resetCustomColors: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('inclusio-theme');
    return (saved as Theme) || 'light';
  });

  const [baseTheme, setBaseTheme] = useState<BaseTheme>(() => {
    const saved = localStorage.getItem('inclusio-base-theme');
    return (saved as BaseTheme) || 'light';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('inclusio-font-size');
    return (saved as FontSize) || 'medium';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const saved = localStorage.getItem('inclusio-high-contrast');
    return saved === 'true';
  });

  const [customColors, setCustomColors] = useState<CustomColors>(() => {
    const saved = localStorage.getItem('inclusio-custom-colors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const resetCustomColors = () => {
    setCustomColors({});
    localStorage.removeItem('inclusio-custom-colors');
    // Remove custom color CSS variables
    const root = document.documentElement;
    root.style.removeProperty('--custom-background');
    root.style.removeProperty('--custom-primary');
    root.style.removeProperty('--custom-accent');
    root.style.removeProperty('--custom-foreground');
  };

  useEffect(() => {
    localStorage.setItem('inclusio-theme', theme);
    localStorage.setItem('inclusio-base-theme', baseTheme);
    localStorage.setItem('inclusio-font-size', fontSize);
    localStorage.setItem('inclusio-high-contrast', String(highContrast));
    localStorage.setItem('inclusio-custom-colors', JSON.stringify(customColors));

    const root = document.documentElement;
    
    // Theme - aplica o tema base visualmente, mesmo se for custom
    root.classList.remove('light', 'dark', 'custom');
    root.classList.add(baseTheme);
    if (theme === 'custom') {
      root.classList.add('custom');
    }

    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
    root.classList.add(`font-size-${fontSize}`);

    // Custom colors - aplica apenas quando o tema é "custom"
    if (theme === 'custom') {
      if (customColors.background) {
        root.style.setProperty('--custom-background', customColors.background);
      } else {
        root.style.removeProperty('--custom-background');
      }

      if (customColors.primary) {
        root.style.setProperty('--custom-primary', customColors.primary);
      } else {
        root.style.removeProperty('--custom-primary');
      }

      if (customColors.accent) {
        root.style.setProperty('--custom-accent', customColors.accent);
      } else {
        root.style.removeProperty('--custom-accent');
      }

      if (customColors.foreground) {
        root.style.setProperty('--custom-foreground', customColors.foreground);
      } else {
        root.style.removeProperty('--custom-foreground');
      }
    } else {
      root.style.removeProperty('--custom-background');
      root.style.removeProperty('--custom-primary');
      root.style.removeProperty('--custom-accent');
      root.style.removeProperty('--custom-foreground');
    }
  }, [theme, baseTheme, fontSize, highContrast, customColors]);

  return (
    <AccessibilityContext.Provider value={{ 
      theme, 
      baseTheme, 
      fontSize, 
      highContrast, 
      customColors,
      setTheme, 
      setBaseTheme, 
      setFontSize, 
      setHighContrast,
      setCustomColors,
      resetCustomColors
    }}>
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
