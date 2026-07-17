import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Shield } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setSubmitting(true);
    // Simulate brief auth delay
    setTimeout(() => {
      setSubmitting(false);
      onLogin();
    }, 400);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep shadow-card">
          <Shield className="h-8 w-8 text-white" />
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-card">
          <h2 className="mb-2 text-center font-display text-2xl font-bold text-emerald-deep">
            ورود به پنل مدیریت
          </h2>
          <p className="mb-6 text-center text-sm text-muted">
            برای دسترسی به بخش مدیریت وارد شوید
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">نام کاربری</label>
              <div className="relative">
                <User className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="نام کاربری..."
                  className="input-field pr-12"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">رمز عبور</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور..."
                  className="input-field pr-12"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !username || !password}
              className="btn-primary w-full"
            >
              {submitting ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          {/* Back button */}
          <button
            onClick={onBack}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs text-muted transition-colors hover:text-emerald-deep"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به سایت
          </button>
        </div>
      </motion.div>
    </div>
  );
}
