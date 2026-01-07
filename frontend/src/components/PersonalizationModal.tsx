import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Sun, Moon, Contrast, Type } from 'lucide-react';

interface PersonalizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonalizationModal({ open, onOpenChange }: PersonalizationModalProps) {
  const { theme, fontSize, highContrast, setTheme, setFontSize, setHighContrast } = useAccessibility();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
                onClick={() => setTheme('light')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  theme === 'light' 
                    ? 'border-accent bg-accent text-accent-foreground' 
                    : 'border-border hover:border-accent'
                }`}
              >
                <Sun className="w-5 h-5" />
                Claro
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  theme === 'dark' 
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
                onClick={() => setHighContrast(false)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  !highContrast 
                    ? 'border-accent bg-accent text-accent-foreground' 
                    : 'border-border hover:border-accent'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setHighContrast(true)}
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
                  onClick={() => setFontSize(option.value)}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
