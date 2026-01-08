import { useState } from 'react';
import logo from '@/assets/inclusio-logo.png';
import { Settings, Palette, Type, Cog } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { PersonalizationModal } from '@/components/PersonalizationModal';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { theme, baseTheme, fontSize, setTheme, setBaseTheme, setFontSize } = useAccessibility();
  const [showPersonalization, setShowPersonalization] = useState(false);

  return (
    <header className="flex items-center justify-between gap-3 p-4 bg-card">
      <div className="flex items-center gap-3">
        <img src={logo} alt="INCLUSIO" className="h-12 w-12 object-contain" />
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Configurações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="mr-2 h-4 w-4" />
              <span>Tema</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme === 'custom' ? 'custom' : theme} onValueChange={(value) => {
                if (value === 'custom') {
                  setShowPersonalization(true);
                } else {
                  const newTheme = value as 'light' | 'dark';
                  setBaseTheme(newTheme);
                  setTheme(newTheme);
                }
              }}>
                <DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Escuro</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="custom">Personalizado</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Type className="mr-2 h-4 w-4" />
              <span>Tamanho da Fonte</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={fontSize} onValueChange={(value) => setFontSize(value as 'small' | 'medium' | 'large' | 'xlarge')}>
                <DropdownMenuRadioItem value="small">Pequeno</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">Médio</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="large">Grande</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="xlarge">Extra Grande</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem>
            <Cog className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <PersonalizationModal 
        open={showPersonalization} 
        onOpenChange={setShowPersonalization} 
      />
    </header>
  );
}
