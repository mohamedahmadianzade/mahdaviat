import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Library, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { adminCredentials } from '../data/credentials';

interface LoginPageProps { onLogin: () => void; onBack: () => void; }

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const found = adminCredentials.find((c) => c.username === username.trim() && c.password === password);
      if (found) onLogin();
      else { setError('نام کاربری یا رمز عبور اشتباه است'); setLoading(false); }
    }, 400);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none fixed inset-0 pattern-bg opacity-60" />
      <div className="pointer-events-none fixed top-0 right-0 h-[500px] w-[500px] rounded-full bg-emerald/5 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gold/5 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-card">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald text-white shadow-card"><Library className="h-7 w-7" /></div>
            <h1 className="font-display text-xl font-bold text-emerald-deep">ورود به پنل مدیریت</h1>
            <p className="mt-2 text-sm text-muted">برای ادامه وارد شوید</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">نام کاربری</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald/50" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field pr-10" placeholder="نام کاربری" autoFocus dir="ltr" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald/50" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field px-10" placeholder="رمز عبور" dir="ltr" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedLight transition-colors hover:text-emerald">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>
            {error && (<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-600"><AlertCircle className="h-4 w-4 shrink-0" />{error}</motion.div>)}
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'در حال ورود...' : 'ورود'}</button>
          </form>
          <button onClick={onBack} className="mt-6 w-full text-center text-xs text-muted transition-colors hover:text-emerald">بازگشت به صفحه اصلی</button>
        </div>
      </motion.div>
    </div>
  );
}
