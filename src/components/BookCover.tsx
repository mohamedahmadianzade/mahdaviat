import { BookOpen } from 'lucide-react';

interface BookCoverProps { title: string; author: string; color: string; size?: 'sm' | 'md' | 'lg'; }
const sizes = { sm: 'h-32 w-24 text-[10px]', md: 'h-52 w-36 text-xs', lg: 'h-80 w-56 text-sm' };

export default function BookCover({ title, author, color, size = 'md' }: BookCoverProps) {
  return (
    <div className={`relative ${sizes[size]} shrink-0 overflow-hidden rounded-xl shadow-card transition-transform duration-300`} style={{ background: `linear-gradient(145deg, ${color}, ${color}dd 60%, ${color}aa)` }}>
      <div className="absolute inset-1.5 rounded-lg border border-gold-light/30" />
      <div className="absolute inset-2.5 rounded-md border border-gold-light/15" />
      <div className="absolute left-0 right-0 top-0 flex justify-center pt-2"><BookOpen className="h-3.5 w-3.5 text-gold-light/70" /></div>
      <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 text-center">
        <p className="font-semibold leading-snug text-gold-soft line-clamp-4">{title}</p>
        <div className="mx-auto my-2 h-px w-8 bg-gold-light/40" />
        <p className="text-[0.7em] leading-tight text-gold-soft/80 line-clamp-2">{author}</p>
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center"><div className="h-1 w-1 rounded-full bg-gold-light/50" /></div>
      <div className="absolute bottom-0 top-0 right-0 w-1.5 bg-white/10" />
    </div>
  );
}
