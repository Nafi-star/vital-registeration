import { Shield } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface RegisterRequiresAdminProps {
  onGoToAdmin: () => void;
}

export function RegisterRequiresAdmin({ onGoToAdmin }: RegisterRequiresAdminProps) {
  const { t } = useLanguage();
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
      <div className="inline-flex rounded-lg bg-violet-100 p-3 mb-4">
        <Shield className="w-8 h-8 text-violet-700" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-2">{t('admin.registerOnly.title')}</h2>
      <p className="text-sm text-slate-600 mb-6">{t('admin.registerOnly.body')}</p>
      <button
        type="button"
        onClick={onGoToAdmin}
        className="inline-flex items-center justify-center rounded-lg bg-violet-700 hover:bg-violet-800 text-white px-5 py-2.5 text-sm font-medium"
      >
        {t('admin.registerOnly.cta')}
      </button>
    </div>
  );
}

export default RegisterRequiresAdmin;
