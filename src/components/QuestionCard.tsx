import { Question } from '@/data/evaluationQuestions';
import { EmojiRating } from './EmojiRating';

interface QuestionCardProps {
  question: Question;
  rating: number | null;
  onRatingChange: (value: number) => void;
}

export function QuestionCard({ question, rating, onRatingChange }: QuestionCardProps) {
  return (
    <div className="bg-secondary rounded-lg p-6 mb-4">
      <h3 className="text-lg font-semibold text-secondary-foreground mb-2">
        {question.id} {question.title}
      </h3>
      <p className="text-muted-foreground mb-4">{question.description}</p>
      <EmojiRating value={rating} onChange={onRatingChange} />
    </div>
  );
}
