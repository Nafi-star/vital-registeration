import { Baby, Heart, Skull, UserX, Search, FileText, ScrollText, Shield, ClipboardList } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import type { StatsOverview, RecordStatus } from '../types';

interface DashboardStats {
  totalBirths: number;
  totalDeaths: number;
  totalMarriages: number;
  totalDivorces: number;
}

interface DashboardProps {
  onNavigate: (page: string, navOpts?: { searchStatus?: 'all' | RecordStatus }) => void;
  stats: DashboardStats;
  statsOverview: StatsOverview | null;
  isAdmin: boolean;
}

export function Dashboard({ onNavigate, stats, statsOverview, isAdmin }: DashboardProps) {
  const { t } = useLanguage();

  const totalRecords =
    stats.totalBirths + stats.totalDeaths + stats.totalMarriages + stats.totalDivorces;

  const percent = (value: number) => {
    if (!totalRecords) return 0;
    return Math.round((value / totalRecords) * 100);
  };

  const adminHubCard = {
    id: 'admin',
    title: t('page.admin'),
    description: t('dashboard.card.admin.description'),
    icon: Shield,
    color: 'bg-violet-700',
    hoverColor: 'hover:bg-violet-800',
  };

  const registerCards = [
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
  ];

  const activityCard = {
    id: 'activity',
    title: t('page.activity'),
    description: t('dashboard.card.activity.description'),
    icon: ScrollText,
    color: 'bg-violet-600',
    hoverColor: 'hover:bg-violet-700',
  };

  const publicCards = [
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

  const cards = [adminHubCard, ...(isAdmin ? [...registerCards, activityCard] : []), ...publicCards];

  const maxTrend = statsOverview
    ? Math.max(
        1,
        ...statsOverview.last6Months.flatMap((m) => [
          m.births,
          m.deaths,
          m.marriages,
          m.divorces,
        ]),
      )
    : 1;

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
                onClick={() => onNavigate(isAdmin ? 'birth' : 'admin')}
                className="inline-flex items-center gap-2 rounded-full bg-white text-sky-700 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors"
              >
                {isAdmin ? <Baby className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                {isAdmin ? t('dashboard.hero.ctaPrimary') : t('dashboard.hero.ctaNeedAdmin')}
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

      {isAdmin && statsOverview?.workflow && statsOverview.workflow.totalPending > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
          <div className="flex gap-3">
            <div className="shrink-0 rounded-lg bg-amber-100 p-2 h-fit">
              <ClipboardList className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-950">
                {t('dashboard.pendingBanner.title')}
              </h3>
              <p className="text-sm text-amber-900/90 mt-1">
                {t('dashboard.pendingBanner.body')
                  .replace('{{total}}', String(statsOverview.workflow.totalPending))
                  .replace('{{b}}', String(statsOverview.workflow.pending.births))
                  .replace('{{d}}', String(statsOverview.workflow.pending.deaths))
                  .replace('{{m}}', String(statsOverview.workflow.pending.marriages))
                  .replace('{{dv}}', String(statsOverview.workflow.pending.divorces))}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('search', { searchStatus: 'Pending' })}
            className="shrink-0 inline-flex items-center justify-center rounded-lg bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 text-sm font-medium"
          >
            {t('dashboard.pendingBanner.cta')}
          </button>
        </div>
      )}

      {statsOverview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              {t('dashboard.monthly.title')}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{statsOverview.thisMonth.month}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {(
                [
                  [t('dashboard.stats.births'), statsOverview.thisMonth.births, 'bg-blue-500'],
                  [t('dashboard.stats.deaths'), statsOverview.thisMonth.deaths, 'bg-slate-600'],
                  [t('dashboard.stats.marriages'), statsOverview.thisMonth.marriages, 'bg-rose-500'],
                  [t('dashboard.stats.divorces'), statsOverview.thisMonth.divorces, 'bg-amber-500'],
                ] as const
              ).map(([label, val, bg], idx) => (
                <div key={idx} className="rounded-lg border border-slate-100 p-3">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className={`text-2xl font-bold text-white rounded-md py-2 ${bg}`}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">{t('dashboard.trends.title')}</h3>
            <p className="text-xs text-slate-500 mb-4">{t('dashboard.trends.subtitle')}</p>
            <div className="space-y-3">
              {statsOverview.last6Months.map((m) => (
                <div key={m.month}>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>{m.month}</span>
                    <span>
                      B{m.births} · D{m.deaths} · M{m.marriages} · DV{m.divorces}
                    </span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 gap-px">
                    <div
                      className="bg-blue-500"
                      style={{ flexGrow: Math.max(0.05, m.births / maxTrend) }}
                      title={t('dashboard.trends.legend.births')}
                    />
                    <div
                      className="bg-slate-600"
                      style={{ flexGrow: Math.max(0.05, m.deaths / maxTrend) }}
                      title={t('dashboard.trends.legend.deaths')}
                    />
                    <div
                      className="bg-rose-500"
                      style={{ flexGrow: Math.max(0.05, m.marriages / maxTrend) }}
                      title={t('dashboard.trends.legend.marriages')}
                    />
                    <div
                      className="bg-amber-500"
                      style={{ flexGrow: Math.max(0.05, m.divorces / maxTrend) }}
                      title={t('dashboard.trends.legend.divorces')}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-blue-500" /> {t('dashboard.trends.legend.births')}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-slate-600" /> {t('dashboard.trends.legend.deaths')}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-rose-500" /> {t('dashboard.trends.legend.marriages')}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-amber-500" /> {t('dashboard.trends.legend.divorces')}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  {t('dashboard.kebele.title')}
                </h3>
                <ul className="space-y-2 text-xs">
                  {statsOverview.topKebeles.slice(0, 6).map((row) => (
                    <li key={row.kebele} className="flex justify-between gap-2">
                      <span className="text-slate-700 truncate">{row.kebele}</span>
                      <span className="font-semibold text-slate-900">{row.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  {t('dashboard.deathCauses.title')}
                </h3>
                <ul className="space-y-2 text-xs">
                  {statsOverview.topDeathCauses.slice(0, 6).map((row) => (
                    <li key={row.cause} className="flex justify-between gap-2">
                      <span className="text-slate-700 truncate">{row.cause}</span>
                      <span className="font-semibold text-slate-900">{row.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

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
