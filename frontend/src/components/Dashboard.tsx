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
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {t('dashboard.welcomeTitle')}
            </h2>
            <p className="text-slate-600">
              {t('dashboard.welcomeBody')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 min-w-[200px]">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500 mb-1">{t('dashboard.stats.births')}</p>
              <p className="text-xl font-semibold text-blue-600">{stats.totalBirths}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500 mb-1">{t('dashboard.stats.deaths')}</p>
              <p className="text-xl font-semibold text-slate-700">{stats.totalDeaths}</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500 mb-1">{t('dashboard.stats.marriages')}</p>
              <p className="text-xl font-semibold text-rose-600">{stats.totalMarriages}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500 mb-1">{t('dashboard.stats.divorces')}</p>
              <p className="text-xl font-semibold text-amber-600">{stats.totalDivorces}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all text-left group"
            >
              <div className={`${card.color} ${card.hoverColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-slate-600">{card.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This system replaces the paper-based registration process. All records are stored digitally for easy access and retrieval.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
