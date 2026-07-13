import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Dialog — perfectly centered on screen ──────────────────────────────────

interface DialogProps { open: boolean; title: string; onClose: () => void; children: React.ReactNode; }

export function Dialog({ open, title, onClose, children }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald/10 bg-white px-5 py-4">
              <h3 className="font-display font-semibold text-emerald-deep">{title}</h3>
              <button onClick={onClose} className="rounded-full p-1.5 text-muted transition-colors hover:bg-emerald-soft hover:text-emerald"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmDialogProps { open: boolean; message: string; onConfirm: () => void; onCancel: () => void; }

export function ConfirmDialog({ open, message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} title="تأیید حذف" onClose={onCancel}>
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button onClick={onCancel} className="btn-ghost">لغو</button>
        <button onClick={onConfirm} className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600 transition-colors">حذف</button>
      </div>
    </Dialog>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────

export function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (<div><label className="mb-1.5 block text-xs font-medium text-muted">{label} {required && <span className="text-rose-500">*</span>}</label>{children}</div>);
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

export function StatusBadge({ active }: { active: boolean }) {
  return (<span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${active ? 'bg-emerald-soft text-emerald-deep' : 'bg-gray-100 text-gray-500'}`}>{active ? 'فعال' : 'غیرفعال'}</span>);
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald/20 py-16 text-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-soft text-emerald">{icon}</div><p className="text-sm text-muted">{message}</p></div>);
}

// ─── AdminSearchInput ─────────────────────────────────────────────────────────

export function AdminSearchInput({ value, onChange, placeholder = 'جستجو...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (<div className="relative"><input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-field pr-4" /></div>);
}
