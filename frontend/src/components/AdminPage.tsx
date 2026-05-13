import { FormEvent, useState } from 'react';
import {
  Baby,
  Heart,
  Skull,
  UserX,
  Search,
  ScrollText,
  Shield,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../AuthContext';

type Page = 'dashboard' | 'birth' | 'death' | 'marriage' | 'divorce' | 'search' | 'activity' | 'certificates';

interface AdminPageProps {
  onNavigate: (page: Page) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const { t } = useLanguage();
  const { isAdmin, adminUsername, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(username.trim(), password);
      setPassword('');
    } catch (err) {
      let msg = err instanceof Error ? err.message : 'Login failed';
      try {
        const j = JSON.parse(msg) as { message?: string | string[] };
        if (typeof j.message === 'string') msg = j.message;
        else if (Array.isArray(j.message)) msg = j.message.join(', ');
      } catch {
        /* keep */
      }
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const hubCard = (
    id: Page,
    title: string,
    desc: string,
    Icon: typeof Baby,
    color: string,
    hover: string,
  ) => (
    <button
      key={id}
      type="button"
      onClick={() => onNavigate(id)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group w-full"
    >
      <div className={`${color} ${hover} w-11 h-11 rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-600">{desc}</p>
    </button>
  );

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="rounded-lg bg-violet-100 p-2">
            <Shield className="w-6 h-6 text-violet-700" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">{t('admin.page.loginTitle')}</h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">{t('admin.page.loginSubtitle')}</p>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">{t('admin.login.username')}</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">{t('admin.login.password')}</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-violet-700 hover:bg-violet-800 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium"
          >
            {busy ? '…' : t('admin.login.submit')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{t('admin.page.hubTitle')}</h2>
          <p className="text-sm text-slate-600 mt-1">
            {t('admin.page.signedInAs')} <strong className="text-slate-900">{adminUsername}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            onNavigate('dashboard');
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          {t('admin.layout.signOut')}
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">{t('admin.page.quickActions')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hubCard('birth', t('page.birth'), t('dashboard.card.birth.description'), Baby, 'bg-blue-500', 'hover:bg-blue-600')}
          {hubCard('death', t('page.death'), t('dashboard.card.death.description'), Skull, 'bg-slate-600', 'hover:bg-slate-700')}
          {hubCard('marriage', t('page.marriage'), t('dashboard.card.marriage.description'), Heart, 'bg-rose-500', 'hover:bg-rose-600')}
          {hubCard('divorce', t('page.divorce'), t('dashboard.card.divorce.description'), UserX, 'bg-amber-600', 'hover:bg-amber-700')}
          {hubCard('search', t('page.search'), t('dashboard.card.search.description'), Search, 'bg-emerald-600', 'hover:bg-emerald-700')}
          {hubCard('activity', t('page.activity'), t('dashboard.card.activity.description'), ScrollText, 'bg-violet-600', 'hover:bg-violet-700')}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="text-sm text-violet-700 hover:text-violet-900 font-medium"
        >
          ← {t('admin.page.backDashboard')}
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
