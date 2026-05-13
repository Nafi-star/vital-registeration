import { useState } from 'react';
import { Search, FileText, Eye, User, Pencil, Download } from 'lucide-react';
import { BirthRecord, DeathRecord, MarriageRecord, DivorceRecord, RecordStatus } from '../types';
import { useLanguage } from '../LanguageContext';
import { personsApi, birthsApi, deathsApi, marriagesApi, divorcesApi } from '../api';
import { useAuth } from '../AuthContext';
import {
  displayChildName,
  displayMotherName,
  displayFatherName,
  displayDeceasedName,
  displaySpouseName,
} from '../utils/names';
import { buildCsv, downloadCsvFile } from '../utils/csv';

interface SearchRecordsProps {
  defaultStatusFilter?: 'all' | RecordStatus;
  onViewCertificate: (type: string, record: unknown) => void;
  onEditRecord?: (type: 'birth' | 'death' | 'marriage' | 'divorce', record: unknown) => void;
  onRecordsMutate?: () => void;
  births: BirthRecord[];
  deaths: DeathRecord[];
  marriages: MarriageRecord[];
  divorces: DivorceRecord[];
}

const statusClasses: Record<RecordStatus, string> = {
  Pending: 'bg-amber-50 text-amber-600 border-amber-200',
  Approved: 'bg-emerald-50 text-green-500 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-600 border-rose-200',
};

function registrationInRange(registrationDate: string, from: string, to: string) {
  if (!from && !to) return true;
  if (from && registrationDate < from) return false;
  if (to && registrationDate > to) return false;
  return true;
}

export function SearchRecords({
  defaultStatusFilter = 'all',
  onViewCertificate,
  onEditRecord,
  onRecordsMutate,
  births,
  deaths,
  marriages,
  divorces,
}: SearchRecordsProps) {
  const [statusBusy, setStatusBusy] = useState(false);
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | RecordStatus>(
    defaultStatusFilter === 'all' ? 'all' : defaultStatusFilter,
  );
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [kebeleFilter, setKebeleFilter] = useState('');
  const [deathCauseFilter, setDeathCauseFilter] = useState('');
  const [personQuery, setPersonQuery] = useState('');
  const [personHistory, setPersonHistory] = useState<unknown>(null);
  const [personLoading, setPersonLoading] = useState(false);
  const [personError, setPersonError] = useState(false);
  const { t } = useLanguage();

  const statusLabel: Record<RecordStatus, string> = {
    Pending: t('search.form.status.pending'),
    Approved: t('search.form.status.approved'),
    Rejected: t('search.form.status.rejected'),
  };

  const setRecordStatus = async (
    kind: 'birth' | 'death' | 'marriage' | 'divorce',
    id: string,
    status: RecordStatus,
  ) => {
    setStatusBusy(true);
    try {
      if (kind === 'birth') await birthsApi.updateStatus(id, status);
      else if (kind === 'death') await deathsApi.updateStatus(id, status);
      else if (kind === 'marriage') await marriagesApi.updateStatus(id, status);
      else await divorcesApi.updateStatus(id, status);
      onRecordsMutate?.();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setStatusBusy(false);
    }
  };

  const filterRecords = <T extends { status?: RecordStatus } & Record<string, unknown>>(records: T[]): T[] => {
    return records.filter((record) => {
      const matchesStatus =
        selectedStatus === 'all' || record.status === selectedStatus || record.status === undefined;

      if (!searchTerm) {
        if (!matchesStatus) return false;
      } else {
        const textMatch = Object.values(record).some(
          (value) =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        if (!matchesStatus || !textMatch) return false;
      }

      const k = kebeleFilter.trim().toLowerCase();
      if (k) {
        const keb = String(record.kebele ?? '').toLowerCase();
        if (!keb.includes(k)) return false;
      }

      const regDate = String(record.registration_date ?? '');
      if (!registrationInRange(regDate, dateFrom, dateTo)) return false;

      return true;
    });
  };

  const filteredBirths =
    selectedType === 'all' || selectedType === 'birth'
      ? (filterRecords(births as (BirthRecord & Record<string, unknown>)[]) as BirthRecord[])
      : [];
  const filteredDeathsRaw =
    selectedType === 'all' || selectedType === 'death'
      ? (filterRecords(deaths as (DeathRecord & Record<string, unknown>)[]) as DeathRecord[])
      : [];
  const dc = deathCauseFilter.trim().toLowerCase();
  const filteredDeaths = dc
    ? filteredDeathsRaw.filter((d) => d.cause_of_death.toLowerCase().includes(dc))
    : filteredDeathsRaw;
  const filteredMarriages =
    selectedType === 'all' || selectedType === 'marriage'
      ? (filterRecords(marriages as (MarriageRecord & Record<string, unknown>)[]) as MarriageRecord[])
      : [];
  const filteredDivorces =
    selectedType === 'all' || selectedType === 'divorce'
      ? (filterRecords(divorces as (DivorceRecord & Record<string, unknown>)[]) as DivorceRecord[])
      : [];

  const totalFilteredRows =
    filteredBirths.length + filteredDeaths.length + filteredMarriages.length + filteredDivorces.length;

  const handleExportCsv = () => {
    const headers = ['record_type', 'reg_no', 'name_summary', 'registration_date', 'status', 'kebele', 'city'];
    const rows: (string | number)[][] = [];
    for (const b of filteredBirths) {
      rows.push([
        'birth',
        b.birth_regno,
        displayChildName(b),
        b.registration_date,
        b.status ?? 'Pending',
        b.kebele,
        b.city,
      ]);
    }
    for (const d of filteredDeaths) {
      rows.push([
        'death',
        d.death_regno,
        displayDeceasedName(d),
        d.registration_date,
        d.status ?? 'Pending',
        d.kebele,
        d.city,
      ]);
    }
    for (const m of filteredMarriages) {
      const pair = `${displaySpouseName('husband', m)} / ${displaySpouseName('wife', m)}`;
      rows.push([
        'marriage',
        m.marriage_regno,
        pair,
        m.registration_date,
        m.status ?? 'Pending',
        m.kebele,
        m.city,
      ]);
    }
    for (const dv of filteredDivorces) {
      const pair = `${displaySpouseName('husband', dv)} / ${displaySpouseName('wife', dv)}`;
      rows.push([
        'divorce',
        dv.divorce_regno,
        pair,
        dv.registration_date,
        dv.status ?? 'Pending',
        dv.kebele,
        dv.city,
      ]);
    }
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    downloadCsvFile(`vital-records-${stamp}.csv`, buildCsv(headers, rows));
  };

  const loadPersonHistory = async () => {
    const q = personQuery.trim();
    if (!q) return;
    setPersonLoading(true);
    setPersonError(false);
    setPersonHistory(null);
    try {
      let hist: unknown = null;
      if (/^P\d/i.test(q)) {
        hist = await personsApi.history(q);
      }
      if (!hist) {
        const matches = await personsApi.search(q);
        const direct =
          matches.find((m) => m.person_public_id.toLowerCase() === q.toLowerCase()) ?? matches[0];
        if (direct) {
          hist = await personsApi.history(direct.person_public_id);
        }
      }
      if (!hist) {
        setPersonError(true);
        return;
      }
      setPersonHistory(hist);
    } catch {
      setPersonError(true);
    } finally {
      setPersonLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('search.form.title')}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('search.form.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('search.form.status')}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | RecordStatus)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">{t('search.form.status.all')}</option>
              <option value="Pending">{t('search.form.status.pending')}</option>
              <option value="Approved">{t('search.form.status.approved')}</option>
              <option value="Rejected">{t('search.form.status.rejected')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('search.form.recordType')}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">{t('search.form.recordType.all')}</option>
              <option value="birth">{t('search.form.recordType.birth')}</option>
              <option value="death">{t('search.form.recordType.death')}</option>
              <option value="marriage">{t('search.form.recordType.marriage')}</option>
              <option value="divorce">{t('search.form.recordType.divorce')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('search.form.dateFrom')}
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('search.form.dateTo')}
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('search.form.kebeleFilter')}
            </label>
            <input
              type="text"
              value={kebeleFilter}
              onChange={(e) => setKebeleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          {(selectedType === 'all' || selectedType === 'death') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('search.form.deathCause')}
              </label>
              <input
                type="text"
                value={deathCauseFilter}
                onChange={(e) => setDeathCauseFilter(e.target.value)}
                placeholder={t('search.form.placeholder')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm text-slate-600">
            {t('search.export.summary').replace('{{count}}', String(totalFilteredRows))}
          </p>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={totalFilteredRows === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-800 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Download className="w-4 h-4" />
            {t('search.export.button')}
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          {t('search.person.title')}
        </h3>
        <p className="text-xs text-slate-500 mb-4">{t('search.person.summary')}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={personQuery}
            onChange={(e) => setPersonQuery(e.target.value)}
            placeholder={t('search.person.placeholder')}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => void loadPersonHistory()}
            disabled={personLoading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {personLoading ? t('search.person.loading') : t('search.person.lookup')}
          </button>
        </div>
        {personError && (
          <p className="mt-3 text-sm text-rose-600">{t('search.person.error')}</p>
        )}
        {personHistory != null && !personError && (
          <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-slate-900 text-slate-100 text-xs p-4">
            {JSON.stringify(personHistory, null, 2)}
          </pre>
        )}
      </div>

      {filteredBirths.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {t('search.table.birth.title')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.regNo')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.childName')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.dateOfBirth')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.parents')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBirths.map((record) => (
                  <tr key={record.id ?? record.birth_regno} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{record.birth_regno}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{displayChildName(record)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{record.date_of_birth}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {displayMotherName(record)} & {displayFatherName(record)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          statusClasses[record.status ?? 'Pending']
                        }`}
                      >
                        {statusLabel[record.status ?? 'Pending']}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        {onEditRecord && record.id && isAdmin && (
                          <button
                            type="button"
                            onClick={() => onEditRecord('birth', record)}
                            className="text-slate-700 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
                          >
                            <Pencil className="w-4 h-4" />
                            {t('search.table.action.editRecord')}
                          </button>
                        )}
                        {isAdmin && record.id && (record.status ?? 'Pending') === 'Pending' && (
                          <div className="flex flex-wrap gap-1">
                            <button
                              type="button"
                              disabled={statusBusy}
                              onClick={() => setRecordStatus('birth', record.id!, 'Approved')}
                              className="text-xs font-medium px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {t('admin.search.approve')}
                            </button>
                            <button
                              type="button"
                              disabled={statusBusy}
                              onClick={() => setRecordStatus('birth', record.id!, 'Rejected')}
                              className="text-xs font-medium px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                              {t('admin.search.reject')}
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => onViewCertificate('birth', record)}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          {t('search.table.action.viewCertificate')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDeaths.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            {t('search.table.death.title')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.regNo')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.name')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.dateOfDeath')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.cause')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeaths.map((record) => (
                  <tr key={record.id ?? record.death_regno} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{record.death_regno}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{displayDeceasedName(record)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{record.date_of_death}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{record.cause_of_death}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          statusClasses[record.status ?? 'Pending']
                        }`}
                      >
                        {statusLabel[record.status ?? 'Pending']}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        {onEditRecord && record.id && isAdmin && (
                          <button
                            type="button"
                            onClick={() => onEditRecord('death', record)}
                            className="text-slate-700 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
                          >
                            <Pencil className="w-4 h-4" />
                            {t('search.table.action.editRecord')}
                          </button>
                        )}
                        {isAdmin && record.id && (record.status ?? 'Pending') === 'Pending' && (
                          <div className="flex flex-wrap gap-1">
                            <button
                              type="button"
                              disabled={statusBusy}
                              onClick={() => setRecordStatus('death', record.id!, 'Approved')}
                              className="text-xs font-medium px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {t('admin.search.approve')}
                            </button>
                            <button
                              type="button"
                              disabled={statusBusy}
                              onClick={() => setRecordStatus('death', record.id!, 'Rejected')}
                              className="text-xs font-medium px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                              {t('admin.search.reject')}
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => onViewCertificate('death', record)}
                          className="text-slate-700 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          {t('search.table.action.viewCertificate')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredMarriages.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            {t('search.table.marriage.title')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.regNo')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.husband')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.wife')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.date')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMarriages.map((record) => (
                  <tr key={record.id ?? record.marriage_regno} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{record.marriage_regno}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{displaySpouseName('husband', record)}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{displaySpouseName('wife', record)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{record.date_of_marriage}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          statusClasses[record.status ?? 'Pending']
                        }`}
                      >
                        {statusLabel[record.status ?? 'Pending']}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        {onEditRecord && record.id && isAdmin && (
                          <button
                            type="button"
                            onClick={() => onEditRecord('marriage', record)}
                            className="text-slate-700 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
                          >
                            <Pencil className="w-4 h-4" />
                            {t('search.table.action.editRecord')}
                          </button>
                        )}
                        {isAdmin && record.id && (record.status ?? 'Pending') === 'Pending' && (
                          <div className="flex flex-wrap gap-1">
                            <button
                              type="button"
                              disabled={statusBusy}
                              onClick={() => setRecordStatus('marriage', record.id!, 'Approved')}
                              className="text-xs font-medium px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {t('admin.search.approve')}
                            </button>
                            <button
                              type="button"
                              disabled={statusBusy}
                              onClick={() => setRecordStatus('marriage', record.id!, 'Rejected')}
                              className="text-xs font-medium px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                              {t('admin.search.reject')}
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => onViewCertificate('marriage', record)}
                          className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          {t('search.table.action.viewCertificate')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDivorces.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            {t('search.table.divorce.title')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.regNo')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.husband')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.wife')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.date')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('search.table.column.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDivorces.map((record) => (
                  <tr key={record.id ?? record.divorce_regno} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{record.divorce_regno}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{displaySpouseName('husband', record)}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{displaySpouseName('wife', record)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{record.date_of_divorce}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          statusClasses[record.status ?? 'Pending']
                        }`}
                      >
                        {statusLabel[record.status ?? 'Pending']}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        {onEditRecord && record.id && isAdmin && (
                          <button
                            type="button"
                            onClick={() => onEditRecord('divorce', record)}
                            className="text-slate-700 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
                          >
                            <Pencil className="w-4 h-4" />
                            {t('search.table.action.editRecord')}
                          </button>
                        )}
                        {isAdmin && record.id && (record.status ?? 'Pending') === 'Pending' && (
                          <div className="flex flex-wrap gap-1">
                            <button
                              type="button"
                              disabled={statusBusy}
                              onClick={() => setRecordStatus('divorce', record.id!, 'Approved')}
                              className="text-xs font-medium px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {t('admin.search.approve')}
                            </button>
                            <button
                              type="button"
                              disabled={statusBusy}
                              onClick={() => setRecordStatus('divorce', record.id!, 'Rejected')}
                              className="text-xs font-medium px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                              {t('admin.search.reject')}
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => onViewCertificate('divorce', record)}
                          className="text-amber-600 hover:text-amber-700 flex items-center gap-1 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          {t('search.table.action.viewCertificate')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchRecords;
