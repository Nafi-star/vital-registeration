import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface LayoutProps {
  children: ReactNode;
  titleKey: string;
  onBack?: () => void;
}

export function Layout({ children, titleKey, onBack }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{t(titleKey)}</h1>
                <p className="text-sm text-slate-600">{t('layout.subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 mr-1">Language</span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 text-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 ${language === 'en' ? 'bg-white text-slate-900' : 'text-slate-600'}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('am')}
                  className={`px-2 py-1 border-l border-slate-200 ${language === 'am' ? 'bg-white text-slate-900' : 'text-slate-600'}`}
                >
                  አማ
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('om')}
                  className={`px-2 py-1 border-l border-slate-200 ${language === 'om' ? 'bg-white text-slate-900' : 'text-slate-600'}`}
                >
                  AfO
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
