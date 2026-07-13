import { motion } from 'framer-motion';
import { Library, ShoppingBag, Network } from 'lucide-react';

interface LandingPageProps { onSelect: (section: 'library' | 'store' | 'organization') => void; }

export default function LandingPage({ onSelect }: LandingPageProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald text-white shadow-card"><Library className="h-7 w-7" /></div>
        <h1 className="font-display text-3xl font-bold text-emerald-deep sm:text-4xl">بنیاد مهدویت خراسان رضوی</h1>
        <p className="mt-3 text-sm text-muted">کتابخانه جامع، فروشگاه محصولات فرهنگی و ساختار سازمانی</p>
      </motion.div>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { key: 'library' as const, icon: <Library className="h-10 w-10" />, title: 'کتابخانه دیجیتال', subtitle: 'جستجو و مطالعه در منابع اسلامی', accentBg: 'bg-emerald', hoverBorder: 'hover:border-emerald/50', hoverShadow: 'hover:shadow-card-hover' },
          { key: 'store' as const, icon: <ShoppingBag className="h-10 w-10" />, title: 'فروشگاه', subtitle: 'محصولات فرهنگی و آموزشی', accentBg: 'bg-gold-deep', hoverBorder: 'hover:border-gold/50', hoverShadow: 'hover:shadow-gold' },
          { key: 'organization' as const, icon: <Network className="h-10 w-10" />, title: 'ساختار سازمانی', subtitle: 'نمودار درختی اعضای بنیاد', accentBg: 'bg-teal', hoverBorder: 'hover:border-teal/50', hoverShadow: 'hover:shadow-card-hover' },
        ].map((item, i) => (
          <motion.button key={item.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }} whileHover={{ y: -8, scale: 1.015 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(item.key)} className={`group flex flex-col items-center rounded-3xl border border-emerald/12 bg-white p-8 text-center shadow-soft transition-all ${item.hoverBorder} ${item.hoverShadow}`}>
            <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${item.accentBg} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>{item.icon}</div>
            <h2 className="font-display text-xl font-bold text-emerald-deep">{item.title}</h2>
            <p className="mt-2 text-sm text-muted">{item.subtitle}</p>
            <div className="mt-6 flex h-8 w-8 items-center justify-center rounded-full border border-emerald/20 text-emerald transition-all group-hover:border-emerald group-hover:bg-emerald group-hover:text-white"><svg viewBox="0 0 16 16" className="h-3.5 w-3.5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3l-5 5 5 5M1 8h14" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
