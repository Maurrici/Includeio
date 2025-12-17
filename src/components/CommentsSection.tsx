import { Textarea } from '@/components/ui/textarea';

interface CommentsSectionProps {
  value: string;
  onChange: (value: string) => void;
  sectionName: string;
}

export function CommentsSection({ value, onChange, sectionName }: CommentsSectionProps) {
  return (
    <div className="bg-secondary rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-secondary-foreground mb-3">
        Anotações e observações sobre a seção
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Registre observações, dificuldades ou sugestões de melhoria para a seção "{sectionName}".
      </p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite seus comentários aqui..."
        className="min-h-[120px] bg-card"
      />
    </div>
  );
}
