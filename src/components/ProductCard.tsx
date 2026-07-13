import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import type { Product, ProductCategory, StoreSettings } from '../types';

interface ProductCardProps { product: Product; category?: ProductCategory; settings: StoreSettings; index: number; onClick: () => void; }

export default function ProductCard({ product, category, settings, index, onClick }: ProductCardProps) {
  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings.contactMode === 'whatsapp') window.open(`https://wa.me/${settings.whatsapp}`, '_blank');
    else window.open(`tel:${settings.phone}`);
  };
  const cover = product.images[0] || '';

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4), ease: 'easeOut' }} whileHover={{ y: -6 }} className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft transition-shadow hover:shadow-card-hover" onClick={onClick}>
      <div className="relative h-48 overflow-hidden bg-cream">
        <img src={cover} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {category && <span className="absolute top-3 right-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-emerald-deep backdrop-blur-sm">{category.name}</span>}
        {product.images.length > 1 && <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">{product.images.length} تصویر</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-emerald-deep transition-colors group-hover:text-emerald">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{product.shortDescription}</p>
        <div className="mt-auto pt-4">
          {product.price && <p className="mb-3 text-sm font-bold text-gold-deep">{product.price}</p>}
          <button onClick={handleContact} className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald/20 bg-emerald-soft px-3 py-2.5 text-xs font-medium text-emerald-deep transition-all hover:bg-emerald hover:text-white hover:border-emerald">
            {settings.contactMode === 'whatsapp' ? <MessageCircle className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
            {settings.contactButtonText}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
