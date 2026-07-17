import { supabase } from './supabaseClient';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  quantity: number;
  notes: string;
  status: string;
  created_at: string;
}

type OrderRow = {
  id: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  quantity: number;
  notes: string;
  status: string;
  created_at: string;
};

const fromRow = (r: OrderRow): Order => ({
  id: r.id,
  product_id: r.product_id,
  product_name: r.product_name,
  customer_name: r.customer_name,
  customer_phone: r.customer_phone,
  quantity: r.quantity,
  notes: r.notes,
  status: r.status,
  created_at: r.created_at,
});

export interface NewOrder {
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  quantity: number;
  notes: string;
}

export async function placeOrder(order: NewOrder): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      product_id: order.product_id,
      product_name: order.product_name,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      quantity: order.quantity,
      notes: order.notes,
      status: 'pending',
    })
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as OrderRow) : { ...order, id: '', status: 'pending', created_at: new Date().toISOString() };
}

export async function adminGetOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(fromRow);
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetOrderStats() {
  const { data, error } = await supabase.from('orders').select('status');
  if (error) throw error;
  const rows = data as Pick<OrderRow, 'status'>[];
  return {
    total: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
  };
}
