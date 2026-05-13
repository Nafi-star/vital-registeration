import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { auditLogsApi } from '../api';
import type { AuditLogEntry } from '../types';
import { useLanguage } from '../LanguageContext';

export function ActivityLog() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    auditLogsApi
      .list(200)
      .then((rows) => {
        if (!cancelled) setLogs(rows);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load audit log.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4 flex items-start gap-3">
        <div className="rounded-lg bg-violet-100 p-2">
          <ClipboardList className="w-5 h-5 text-violet-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{t('activity.page.title')}</h2>
          <p className="text-sm text-slate-600">{t('activity.page.subtitle')}</p>
        </div>
      </div>

      <div className="p-6">
        {loading && <p className="text-sm text-slate-500">{t('search.person.loading')}</p>}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}
        {!loading && !error && logs.length === 0 && (
          <p className="text-sm text-slate-600">{t('activity.empty')}</p>
        )}
        {!loading && !error && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                    {t('activity.column.time')}
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                    {t('activity.column.actor')}
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                    {t('activity.column.action')}
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                    {t('activity.column.entity')}
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-700">
                    {t('activity.column.details')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 align-top">
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-slate-900">{row.actor ?? '—'}</td>
                    <td className="px-3 py-2 text-slate-900 font-medium">{row.action}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                      {row.entity_type} <span className="text-slate-400">/</span>{' '}
                      <span className="font-mono text-xs">{row.entity_id}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 max-w-md break-words">
                      {row.details ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityLog;
