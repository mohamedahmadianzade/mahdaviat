import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCog,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Search,
  Shield,
  CheckCircle2,
  Store,
  BookOpen,
  Network,
  Mic,
} from 'lucide-react';
import {
  adminGetUsers,
  adminSaveUser,
  adminDeleteUser,
  newId,
  emptyAdminUser,
} from '../../lib/adminUsersApi';
import type { AdminUser } from '../../lib/adminUsersApi';
import { Dialog, ConfirmDialog, FormField } from './AdminUI';

type UserForm = Omit<AdminUser, 'id' | 'created_at'>;

const toForm = (u: AdminUser): UserForm => ({
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

const fromForm = (f: UserForm): AdminUser => ({
  id: '',
  created_at: new Date().toISOString(),
  ...f,
});

interface PermToggleProps {
  label: string;
  icon: typeof Store;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function PermToggle({ label, icon: Icon, checked, onChange }: PermToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
        checked
          ? 'border-emerald bg-emerald-soft/50'
          : 'border-emerald/10 bg-white hover:border-emerald/30'
      }`}
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${checked ? 'bg-emerald text-white' : 'bg-cream text-muted'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className={`flex-1 text-right text-sm font-medium ${checked ? 'text-emerald-deep' : 'text-muted'}`}>
        {label}
      </span>
      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${checked ? 'border-emerald bg-emerald' : 'border-mutedLight'}`}>
        {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
      </div>
    </button>
  );
}

export default function AdminUsers() {
  const [list, setList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminGetUsers();
      setList(data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyAdminUser() });
    setError('');
  };

  const openEdit = (user: AdminUser) => {
    setEditing(user);
    setForm(toForm(user));
    setError('');
  };

  const closeForm = () => {
    setEditing(null);
    setForm(null);
    setError('');
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.username.trim() || !form.password.trim()) {
      setError('نام کاربری و رمز عبور الزامی است');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const record: AdminUser = {
        id: editing?.id ?? newId(),
        created_at: editing?.created_at ?? new Date().toISOString(),
        ...form,
      };
      await adminSaveUser(record);
      await load();
      closeForm();
    } catch {
      setError('خطا در ذخیره کاربر');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteUser(deleteId);
      setList((prev) => prev.filter((u) => u.id !== deleteId));
    } catch {
      // ignore
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = list.filter((u) =>
    !search ||
    u.username.includes(search) ||
    u.full_name.includes(search)
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-soft text-emerald-deep">
            <UserCog className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-emerald-deep">کاربران مدیریت</h2>
            <p className="text-xs text-muted">{list.length.toLocaleString('fa-IR')} کاربر تعریف شده</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          افزودن کاربر
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی کاربر..."
          className="input-field pr-12"
        />
      </div>

      {/* User list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald/20 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-soft text-emerald">
            <UserCog className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted">کاربری یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              className="rounded-2xl border border-emerald/10 bg-white p-4 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${user.is_super_admin ? 'bg-gradient-to-br from-emerald to-emerald-deep text-white' : 'bg-emerald-soft text-emerald-deep'}`}>
                    {user.is_super_admin ? <Shield className="h-5 w-5" /> : <UserCog className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-emerald-deep">
                        {user.full_name || user.username}
                      </span>
                      {user.is_super_admin && (
                        <span className="rounded-full bg-emerald px-2 py-0.5 text-[10px] font-medium text-white">
                          مدیر کل
                        </span>
                      )}
                      {!user.active && (
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                          غیرفعال
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted">@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {user.can_access_store && <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[10px] text-gold-deep">فروشگاه</span>}
                    {user.can_access_library && <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] text-emerald-deep">کتابخانه</span>}
                    {user.can_access_organization && <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] text-teal-dark">سازمانی</span>}
                    {user.can_access_moballeghin && <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] text-emerald">مبلغین</span>}
                  </div>
                  <button onClick={() => openEdit(user)} className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-deep transition-colors hover:bg-emerald-soft" title="ویرایش">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteId(user.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50" title="حذف">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={form !== null} title={editing ? 'ویرایش کاربر' : 'افزودن کاربر جدید'} onClose={closeForm}>
        {form && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="نام کاربری" required>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input-field"
                  placeholder="username"
                  dir="ltr"
                />
              </FormField>
              <FormField label="رمز عبور" required>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••"
                  dir="ltr"
                />
              </FormField>
            </div>

            <FormField label="نام و نام خانوادگی">
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="input-field"
                placeholder="نام کامل"
              />
            </FormField>

            <div>
              <p className="mb-2 text-xs font-medium text-muted">سطوح دسترسی</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <PermToggle label="دسترسی به فروشگاه" icon={Store} checked={form.can_access_store} onChange={(v) => setForm({ ...form, can_access_store: v })} />
                <PermToggle label="دسترسی به کتابخانه" icon={BookOpen} checked={form.can_access_library} onChange={(v) => setForm({ ...form, can_access_library: v })} />
                <PermToggle label="دسترسی به ساختار سازمانی" icon={Network} checked={form.can_access_organization} onChange={(v) => setForm({ ...form, can_access_organization: v })} />
                <PermToggle label="دسترسی به مبلغین" icon={Mic} checked={form.can_access_moballeghin} onChange={(v) => setForm({ ...form, can_access_moballeghin: v })} />
              </div>
            </div>

            <div className="space-y-2">
              <PermToggle label="مدیر کل (دسترسی کامل + مدیریت کاربران)" icon={Shield} checked={form.is_super_admin} onChange={(v) => setForm({ ...form, is_super_admin: v })} />
              <PermToggle label="کاربر فعال" icon={CheckCircle2} checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <div className="flex justify-end gap-3">
              <button onClick={closeForm} className="btn-ghost">انصراف</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        message="آیا از حذف این کاربر مطمئن هستید؟"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
