import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle, Tag, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductCategory, StoreSettings } from '../types';
import ProductCard from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  category?: ProductCategory;
  similar: Product[];
  categoryMap: Map<string, ProductCategory>;
  settings: StoreSettings;
  onBack: () => void;
  onSimilarClick: (id: string) => void;
}

export default function ProductDetails({ product, category, similar, categoryMap, settings, onBack, onSimilarClick }: ProductDetailsProps) {
  const images = product.images.length > 0 ? product.images : [''];
  const [idx, setIdx] = useState(0);

  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);

  // Reset index when product changes
  useEffect(() => { setIdx(0); }, [product.id]);

  // Auto-advance every 4s
  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, images.length]);

  const handleContact = () => {
    if (settings.contactMode === 'whatsapp') window.open(`https://wa.me/${settings.whatsapp}`, '_blank');
    else window.open(`tel:${settings.phone}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <button onClick={onBack} className="group mb-6 inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-white/60 px-4 py-2 text-sm text-emerald-deep transition-all hover:bg-emerald-soft">
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />بازگشت به فروشگاه
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ─── Slider ─── */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.05 }} className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-cream shadow-card">
            <div className="relative h-72 sm:h-96">
              <AnimatePresence mode="wait">
                <motion.img
                  key={idx}
                  src={images[idx]}
                  alt={`${product.name} - تصویر ${idx + 1}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow backdrop-blur-sm transition-all hover:bg-white" aria-label="تصویر قبلی">
                    <ChevronRight className="h-5 w-5 text-emerald-deep" />
                  </button>
                  <button onClick={next} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow backdrop-blur-sm transition-all hover:bg-white" aria-label="تصویر بعدی">
                    <ChevronLeft className="h-5 w-5 text-emerald-deep" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIdx(i)}
                        className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-emerald' : 'w-2 bg-white/60 hover:bg-white'}`}
                        aria-label={`تصویر ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === idx ? 'border-emerald opacity-100' : 'border-transparent opacity-60 hover:opacity-90'}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── Info ─── */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col">
          {category && <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-soft px-3 py-1 text-xs font-medium text-emerald-deep"><ShoppingBag className="h-3 w-3" />{category.name}</span>}
          <h1 className="font-display text-2xl font-bold text-emerald-deep sm:text-3xl">{product.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
          {product.price && <p className="mt-4 text-2xl font-bold text-gold-deep">{product.price}</p>}
          <div className="mt-5 rounded-2xl border border-emerald/10 bg-white/70 p-4"><p className="text-sm leading-loose text-muted">{product.description}</p></div>
          {product.keywords.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-deep"><Tag className="h-4 w-4" />کلیدواژه‌ها</h3>
              <div className="flex flex-wrap gap-2">{product.keywords.map((k) => <span key={k} className="rounded-full border border-gold/30 bg-gold-soft/40 px-3 py-1 text-xs text-gold-deep">{k}</span>)}</div>
            </div>
          )}
          <div className="mt-6 rounded-2xl border border-emerald/15 bg-emerald-soft/50 p-4">
            <p className="mb-3 text-sm font-medium text-emerald-deep">اطلاعات تماس</p>
            <button onClick={handleContact} className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald px-4 py-3 text-sm font-medium text-white shadow-soft transition-all hover:bg-emerald-deep hover:shadow-card">
              {settings.contactMode === 'whatsapp' ? <MessageCircle className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
              {settings.contactButtonText}
            </button>
            <p className="mt-2 text-center text-xs text-muted">{settings.contactMode === 'whatsapp' ? settings.whatsapp : settings.phone}</p>
          </div>
        </motion.div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-emerald-deep"><ShoppingBag className="h-5 w-5 text-gold" />محصولات مرتبط</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s, i) => <ProductCard key={s.id} product={s} category={categoryMap.get(s.categoryId)} settings={settings} index={i} onClick={() => onSimilarClick(s.id)} />)}
          </div>
        </div>
      )}
    </motion.div>
  );
}
