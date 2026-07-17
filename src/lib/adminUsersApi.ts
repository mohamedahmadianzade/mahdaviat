import { supabase } from './supabaseClient';

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  full_name: string;
  can_access_store: boolean;
  can_access_library: boolean;
  can_access_organization: boolean;
  can_access_moballeghin: boolean;
  is_super_admin: boolean;
  active: boolean;
  created_at: string;
}

export interface AdminPermissions {
  can_access_store: boolean;
  can_access_library: boolean;
  can_access_organization: boolean;
  can_access_moballeghin: boolean;
  is_super_admin: boolean;
}

type AdminUserRow = {
  id: string;
  username: string;
  password: string;
  full_name: string;
  can_access_store: boolean;
  can_access_library: boolean;
  can_access_organization: boolean;
  can_access_moballeghin: boolean;
  is_super_admin: boolean;
  active: boolean;
  created_at: string;
};

const fromRow = (r: AdminUserRow): AdminUser => ({
  id: r.id,
  username: r.username,
  password: r.password,
  full_name: r.full_name,
  can_access_store: r.can_access_store,
  can_access_library: r.can_access_library,
  can_access_organization: r.can_access_organization,
  can_access_moballeghin: r.can_access_moballeghin,
  is_super_admin: r.is_super_admin,
  active: r.active,
  created_at: r.created_at,
});

const toRow = (u: AdminUser) => ({
  id: u.id,
  username: u.username,
  password: u.password,
  full_name: u.full_name,
  can_access_store: u.can_access_store,
  can_access_library: u.can_access_library,
  can_access_organization: u.can_access_organization,
  can_access_moballeghin: u.can_access_moballeghin,
  is_super_admin: u.is_super_admin,
  active: u.active,
});

export function newId(): string { return crypto.randomUUID(); }

export const emptyAdminUser = (): Omit<AdminUser, 'id' | 'created_at'> => ({
  username: '',
  password: '',
  full_name: '',
  can_access_store: false,
  can_access_library: false,
  can_access_organization: false,
  can_access_moballeghin: false,
  is_super_admin: false,
  active: true,
});

export async function authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .eq('active', true)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as AdminUserRow) : null;
}

export function extractPermissions(user: AdminUser): AdminPermissions {
  return {
    can_access_store: user.can_access_store,
    can_access_library: user.can_access_library,
    can_access_organization: user.can_access_organization,
    can_access_moballeghin: user.can_access_moballeghin,
    is_super_admin: user.is_super_admin,
  };
}

export async function adminGetUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as AdminUserRow[]).map(fromRow);
}

export async function adminSaveUser(user: AdminUser): Promise<AdminUser> {
  const row = toRow(user);
  const { data, error } = await supabase
    .from('admin_users')
    .upsert(row)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as AdminUserRow) : user;
}

export async function adminDeleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('admin_users').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetUserStats() {
  const { data, error } = await supabase.from('admin_users').select('active, is_super_admin');
  if (error) throw error;
  const rows = data as Pick<AdminUserRow, 'active' | 'is_super_admin'>[];
  return {
    total: rows.length,
    active: rows.filter((r) => r.active).length,
    superAdmins: rows.filter((r) => r.is_super_admin).length,
  };
}
