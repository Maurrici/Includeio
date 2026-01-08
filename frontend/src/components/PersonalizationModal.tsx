import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Sun, Moon, Contrast, Type, Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PersonalizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonalizationModal({ open, onOpenChange }: PersonalizationModalProps) {
  const { 
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
  } = useAccessibility();

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setBaseTheme(newTheme);
    setTheme('custom'); // Marca como personalizado quando altera no modal
  };

  const handleFontSizeChange = (newSize: 'small' | 'medium' | 'large' | 'xlarge') => {
    setFontSize(newSize);
    setTheme('custom'); // Marca como personalizado quando altera
  };

  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    setTheme('custom'); // Marca como personalizado quando altera
  };

  const handleColorChange = (colorType: 'background' | 'primary' | 'accent' | 'foreground', color: string) => {
    // Valida se é uma cor hex válida
    if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
      setCustomColors({
        ...customColors,
        [colorType]: color
      });
      setTheme('custom'); // Marca como personalizado quando altera
    }
  };

  // Função auxiliar para obter cor padrão baseada no tema
  const getDefaultColor = (colorType: 'background' | 'primary' | 'accent' | 'foreground'): string => {
    if (baseTheme === 'dark') {
      switch (colorType) {
        case 'background': return '#1a2332';
        case 'primary': return '#4a9eff';
        case 'accent': return '#4a9eff';
        case 'foreground': return '#f5f7fa';
        default: return '#000000';
      }
    } else {
      switch (colorType) {
        case 'background': return '#f5f7fa';
        case 'primary': return '#2563eb';
        case 'accent': return '#4a9eff';
        case 'foreground': return '#1a2332';
        default: return '#000000';
      }
    }
  };

  const getColorValue = (colorType: 'background' | 'primary' | 'accent' | 'foreground'): string => {
    return customColors[colorType] || getDefaultColor(colorType);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Personalizar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Theme */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Tema
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  baseTheme === 'light'
                    ? 'border-accent bg-accent text-accent-foreground' 
                    : 'border-border hover:border-accent'
                }`}
              >
                <Sun className="w-5 h-5" />
                Claro
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  baseTheme === 'dark'
                    ? 'border-accent bg-accent text-accent-foreground' 
                    : 'border-border hover:border-accent'
                }`}
              >
                <Moon className="w-5 h-5" />
                Escuro
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Contrast className="w-5 h-5" />
              Alto Contraste
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleHighContrastChange(false)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  !highContrast 
                    ? 'border-accent bg-accent text-accent-foreground' 
                    : 'border-border hover:border-accent'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => handleHighContrastChange(true)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  highContrast 
                    ? 'border-accent bg-accent text-accent-foreground' 
                    : 'border-border hover:border-accent'
                }`}
              >
                Alto Contraste
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Tamanho da Fonte
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'small' as const, label: 'P' },
                { value: 'medium' as const, label: 'M' },
                { value: 'large' as const, label: 'G' },
                { value: 'xlarge' as const, label: 'GG' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFontSizeChange(option.value)}
                  className={`py-3 px-4 rounded-lg border-2 transition-colors font-semibold ${
                    fontSize === option.value 
                      ? 'border-accent bg-accent text-accent-foreground' 
                      : 'border-border hover:border-accent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Pequeno • Médio • Grande • Extra Grande
            </p>
          </div>

          {/* Custom Colors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Cores Personalizadas
              </h3>
              {(customColors.background || customColors.primary || customColors.accent || customColors.foreground) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCustomColors}
                  className="h-8 text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Resetar
                </Button>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Label htmlFor="color-background" className="w-24 text-sm">Fundo</Label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    id="color-background"
                    type="color"
                    value={getColorValue('background')}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={getColorValue('background')}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm font-mono"
                    placeholder="#f5f7fa"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="color-primary" className="w-24 text-sm">Primária</Label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    id="color-primary"
                    type="color"
                    value={getColorValue('primary')}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={getColorValue('primary')}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm font-mono"
                    placeholder="#2563eb"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="color-accent" className="w-24 text-sm">Destaque</Label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    id="color-accent"
                    type="color"
                    value={getColorValue('accent')}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={getColorValue('accent')}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm font-mono"
                    placeholder="#4a9eff"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="color-foreground" className="w-24 text-sm">Texto</Label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    id="color-foreground"
                    type="color"
                    value={getColorValue('foreground')}
                    onChange={(e) => handleColorChange('foreground', e.target.value)}
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={getColorValue('foreground')}
                    onChange={(e) => handleColorChange('foreground', e.target.value)}
                    className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm font-mono"
                    placeholder="#1a2332"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
