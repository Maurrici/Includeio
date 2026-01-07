import { Accessibility } from 'lucide-react';

interface PersonalizeButtonProps {
  onClick: () => void;
}

export function PersonalizeButton({ onClick }: PersonalizeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 left-4 flex items-center gap-2 text-foreground hover:text-accent transition-colors"
    >
      <span className="font-medium">Personalize o site</span>
      <span className="font-bold text-accent">AQUI!</span>
      <Accessibility className="w-5 h-5" />
    </button>
  );
}
