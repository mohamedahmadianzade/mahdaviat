import { motion } from 'framer-motion';
import { Library, ShoppingBag, Network, Mic, ArrowLeft } from 'lucide-react';

type Section = 'library' | 'store' | 'organization' | 'moballeghin';

interface LandingPageProps {
  onSelect: (section: Section) => void;
}

const cards: {
  key: Section;
  title: string;
  subtitle: string;
  icon: typeof Library;
  gradient: string;
  iconBg: string;
}[] = [
  {
    key: 'library',
    title: 'کتابخانه دیجیتال',
    subtitle: 'جستجو و دسترسی به هزاران کتاب، نسخه خطی و منابع علمی',
    icon: Library,
    gradient: 'from-emerald to-emerald-deep',
    iconBg: 'bg-emerald-soft text-emerald-deep',
  },
  {
    key: 'store',
    title: 'فروشگاه',
    subtitle: 'محصولات فرهنگی، کتاب‌ها و اقلام مهدوی',
    icon: ShoppingBag,
    gradient: 'from-gold to-gold-deep',
    iconBg: 'bg-gold-soft text-gold-deep',
  },
  {
    key: 'organization',
    title: 'ساختار سازمانی',
    subtitle: 'آشنایی با اعضا و چارت سازمانی بنیاد مهدویت',
    icon: Network,
    gradient: 'from-teal to-teal-dark',
    iconBg: 'bg-teal/10 text-teal',
  },
  {
    key: 'moballeghin',
    title: 'مبلغین',
    subtitle: 'فرم ثبت‌نام و مدیریت مبلغین بنیاد مهدویت خراسان رضوی',
    icon: Mic,
    gradient: 'from-emerald-light to-emerald',
    iconBg: 'bg-emerald-soft text-emerald-deep',
  },
];

export default function LandingPage({ onSelect }: LandingPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald to-emerald-deep shadow-card">
          <Library className="h-10 w-10 text-white" />
        </div>
        <h1 className="mb-3 font-display text-3xl font-bold text-emerald-deep sm:text-4xl">
          بنیاد مهدویت خراسان رضوی
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted sm:text-base">
          کتابخانه جامع، فروشگاه محصولات فرهنگی و ساختار سازمانی
        </p>
        <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-emerald via-gold to-teal" />
      </motion.div>

      {/* Cards */}
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(card.key)}
              className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-emerald/10 bg-white p-8 text-center shadow-soft transition-shadow hover:shadow-card-hover"
            >
              {/* Gradient top bar */}
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.gradient}`} />

              {/* Icon */}
              <div
                className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="h-10 w-10" />
              </div>

              {/* Title */}
              <h3 className="mb-2 font-display text-xl font-bold text-emerald-deep">
                {card.title}
              </h3>

              {/* Subtitle */}
              <p className="mb-6 text-sm leading-relaxed text-muted">
                {card.subtitle}
              </p>

              {/* CTA */}
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald transition-colors group-hover:text-emerald-deep">
                ورود به بخش
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
