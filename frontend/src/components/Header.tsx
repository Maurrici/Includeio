import logo from '@/assets/inclusio-logo.png';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 p-4 bg-card">
      <img src={logo} alt="INCLUSIO" className="h-12 w-12 object-contain" />
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
    </header>
  );
}
