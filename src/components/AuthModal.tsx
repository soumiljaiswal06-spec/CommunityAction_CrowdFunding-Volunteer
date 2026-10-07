import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, MapPin, Sparkles, AlertCircle, Shield } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { login, register, demoAccounts, switchUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to login');
      }
    } else {
      const res = await register(name, email, password, location);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to register');
      }
    }
    setLoading(false);
  };

  const handleQuickDemoLogin = (acc: any) => {
    switchUser(acc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {mode === 'login' ? 'Citizen Sign In' : 'Create Community Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'login' ? 'Access your projects, contributions & impact' : 'Join local citizens driving real neighborhood change'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Quick Demo Switcher Banner for Presentation */}
          <div className="mb-5 p-3.5 bg-emerald-50/90 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLEGE DEMO • 1-CLICK INSTANT LOGIN:</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {demoAccounts.map(acc => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc)}
                  className="flex items-center justify-between px-2.5 py-1.5 text-xs bg-white hover:bg-emerald-100 border border-emerald-200 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src={acc.avatar} alt={acc.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-semibold text-slate-800">{acc.name}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 text-[10px] rounded font-bold uppercase ${
                    acc.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {acc.role === 'admin' ? 'Admin' : 'Citizen'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Neighborhood / Ward / City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. North Ward, Green Valley"
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all text-sm mt-2"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Free Account'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-slate-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Log in here
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
