interface EmojiRatingProps {
  value: number | null;
  onChange: (value: number) => void;
}

const emojis = [
  { value: 1, emoji: '😠', label: 'Discordo totalmente' },
  { value: 2, emoji: '😞', label: 'Discordo' },
  { value: 3, emoji: '😐', label: 'Neutro' },
  { value: 4, emoji: '😊', label: 'Concordo' },
  { value: 5, emoji: '🤩', label: 'Concordo totalmente' },
];

export function EmojiRating({ value, onChange }: EmojiRatingProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {emojis.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={`flex flex-col items-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-2 ${
            value === item.value ? 'scale-110 ring-2 ring-accent bg-secondary' : ''
          }`}
          title={item.label}
          aria-label={`${item.label} - ${item.value}`}
        >
          <span className="text-4xl">{item.emoji}</span>
          <span className="text-lg font-bold text-foreground mt-1">{item.value}</span>
        </button>
      ))}
    </div>
  );
}
