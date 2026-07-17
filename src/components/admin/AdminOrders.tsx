import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Trash2, Loader2, Phone, User, StickyNote } from 'lucide-react';
import { adminGetOrders, adminUpdateOrderStatus, adminDeleteOrder } from '../../lib/ordersApi';
import type { Order } from '../../lib/ordersApi';
import { ConfirmDialog, EmptyState } from './AdminUI';

const statusLabels: Record<string, string> = {
  pending: 'در انتظار',
  confirmed: 'تأیید شده',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
};

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-soft text-emerald-deep',
  cancelled: 'bg-rose-100 text-rose-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminGetOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await adminUpdateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteOrder(deleteId);
      setOrders((prev) => prev.filter((o) => o.id !== deleteId));
    } catch {
      // ignore
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-soft text-emerald-deep">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-emerald-deep">سفارش‌های فروشگاه</h2>
          <p className="text-xs text-muted">{orders.length.toLocaleString('fa-IR')} سفارش ثبت شده است</p>
        </div>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <EmptyState message="هیچ سفارشی ثبت نشده است" icon={<Package className="h-6 w-6" />} />
      ) : (
        <div className="space-y-3">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              className="rounded-2xl border border-emerald/10 bg-white p-4 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Product + customer info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-emerald" />
                    <span className="font-display text-sm font-bold text-emerald-deep">{order.product_name}</span>
                    <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-medium text-gold-deep">
                      × {order.quantity.toLocaleString('fa-IR')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {order.customer_name}
                    </span>
                    <span className="flex items-center gap-1.5" dir="ltr">
                      <Phone className="h-3.5 w-3.5" />
                      {order.customer_phone}
                    </span>
                    <span>{new Date(order.created_at).toLocaleDateString('fa-IR')}</span>
                  </div>
                  {order.notes && (
                    <div className="flex items-start gap-1.5 text-xs text-muted">
                      <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{order.notes}</span>
                    </div>
                  )}
                </div>

                {/* Status + actions */}
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${statusStyles[order.status] ?? statusStyles.pending}`}
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  {updatingId === order.id && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
                  <button
                    onClick={() => setDeleteId(order.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                    title="حذف سفارش"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteId !== null}
        message="آیا از حذف این سفارش مطمئن هستید؟"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
