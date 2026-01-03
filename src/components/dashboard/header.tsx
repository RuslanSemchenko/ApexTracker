import { TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center gap-4 border-b px-4 md:px-6 h-16">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          ApexTracker
        </h1>
      </div>
    </header>
  );
}
