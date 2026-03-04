import { Baby, Heart, Skull, UserX, Search, FileText } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface DashboardStats {
  totalBirths: number;
  totalDeaths: number;
  totalMarriages: number;
  totalDivorces: number;
}

interface DashboardProps {
  onNavigate: (page: string) => void;
  stats: DashboardStats;
}

export function Dashboard({ onNavigate, stats }: DashboardProps) {
  const { t } = useLanguage();

  const totalRecords =
    stats.totalBirths + stats.totalDeaths + stats.totalMarriages + stats.totalDivorces;

  const percent = (value: number) => {
    if (!totalRecords) return 0;
    return Math.round((value / totalRecords) * 100);
  };

  const cards = [
    {
      id: 'birth',
      title: t('page.birth'),
      description: t('dashboard.card.birth.description'),
      icon: Baby,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      id: 'death',
      title: t('page.death'),
      description: t('dashboard.card.death.description'),
      icon: Skull,
      color: 'bg-slate-600',
      hoverColor: 'hover:bg-slate-700',
    },
    {
      id: 'marriage',
      title: t('page.marriage'),
      description: t('dashboard.card.marriage.description'),
      icon: Heart,
      color: 'bg-rose-500',
      hoverColor: 'hover:bg-rose-600',
    },
    {
      id: 'divorce',
      title: t('page.divorce'),
      description: t('dashboard.card.divorce.description'),
      icon: UserX,
      color: 'bg-amber-600',
      hoverColor: 'hover:bg-amber-700',
    },
    {
      id: 'search',
      title: t('page.search'),
      description: t('dashboard.card.search.description'),
      icon: Search,
      color: 'bg-emerald-600',
      hoverColor: 'hover:bg-emerald-700',
    },
    {
      id: 'certificates',
      title: t('page.certificates'),
      description: t('dashboard.card.certificates.description'),
      icon: FileText,
      color: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero / introduction */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 text-white shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#fff,_transparent_60%)]" />
        <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide uppercase mb-3 border border-white/20">
              {t('dashboard.hero.tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
              {t('dashboard.welcomeTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-100/90 mb-5">
              {t('dashboard.welcomeBody')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('birth')}
                className="inline-flex items-center gap-2 rounded-full bg-white text-sky-700 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Baby className="w-4 h-4" />
                {t('dashboard.hero.ctaPrimary')}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('search')}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 transition-colors"
              >
                <Search className="w-4 h-4" />
                {t('dashboard.hero.ctaSecondary')}
              </button>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 sm:px-5 sm:py-4 min-w-[220px]">
            <p className="text-xs uppercase tracking-wide text-slate-100/80 mb-2">
              {t('dashboard.activity.title')}
            </p>
            <p className="text-3xl font-semibold mb-1">{totalRecords}</p>
            <p className="text-xs text-slate-100/80 mb-3">
              {t('dashboard.activity.subtitle')}
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span>{t('dashboard.stats.births')}</span>
                <span className="font-semibold">{stats.totalBirths}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>{t('dashboard.stats.deaths')}</span>
                <span className="font-semibold">{stats.totalDeaths}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>{t('dashboard.stats.marriages')}</span>
                <span className="font-semibold">{stats.totalMarriages}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>{t('dashboard.stats.divorces')}</span>
                <span className="font-semibold">{stats.totalDivorces}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detailed stats card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {t('dashboard.activity.title')}
              </h3>
              <p className="text-xs text-slate-500">{t('dashboard.activity.subtitle')}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">
              {totalRecords} total records
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">{t('dashboard.stats.births')}</span>
                <span className="font-semibold text-slate-900">
                  {stats.totalBirths} ({percent(stats.totalBirths)}%)
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${percent(stats.totalBirths)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">{t('dashboard.stats.deaths')}</span>
                <span className="font-semibold text-slate-900">
                  {stats.totalDeaths} ({percent(stats.totalDeaths)}%)
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-slate-600 rounded-full transition-all"
                  style={{ width: `${percent(stats.totalDeaths)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">{t('dashboard.stats.marriages')}</span>
                <span className="font-semibold text-slate-900">
                  {stats.totalMarriages} ({percent(stats.totalMarriages)}%)
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all"
                  style={{ width: `${percent(stats.totalMarriages)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">{t('dashboard.stats.divorces')}</span>
                <span className="font-semibold text-slate-900">
                  {stats.totalDivorces} ({percent(stats.totalDivorces)}%)
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${percent(stats.totalDivorces)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick navigation cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {t('dashboard.quickActions.title')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('dashboard.quickActions.subtitle')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => onNavigate(card.id)}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
                >
                  <div
                    className={`${card.color} ${card.hoverColor} w-11 h-11 rounded-lg flex items-center justify-center mb-3 transition-colors`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-600">{card.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* System note */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-xs sm:text-sm text-sky-900">
          <strong>Note:</strong> This system replaces the paper-based registration process. All
          records are stored digitally for faster service, better accuracy, and easier retrieval.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
