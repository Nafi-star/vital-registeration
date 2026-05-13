import { useLanguage } from '../LanguageContext';

interface AdminGateProps {
  onGoToAdmin: () => void;
}

export function AdminGate({ onGoToAdmin }: AdminGateProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-slate-900 mb-2">{t('admin.gate.title')}</h2>
      <p className="text-sm text-slate-600 mb-6">{t('admin.gate.subtitle')}</p>
      <button
        type="button"
        onClick={onGoToAdmin}
        className="inline-flex items-center justify-center rounded-lg bg-violet-700 hover:bg-violet-800 text-white px-5 py-2.5 text-sm font-medium"
      >
        {t('admin.gate.signInButton')}
      </button>
    </div>
  );
}

export default AdminGate;
