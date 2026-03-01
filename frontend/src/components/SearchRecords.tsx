import { useState } from 'react';
import { Search, FileText, Eye } from 'lucide-react';
import { BirthRecord, DeathRecord, MarriageRecord, DivorceRecord, RecordStatus } from '../types';
import { useLanguage } from '../LanguageContext';

interface SearchRecordsProps {
  onViewCertificate: (type: string, record: unknown) => void;
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

export function SearchRecords({ onViewCertificate, births, deaths, marriages, divorces }: SearchRecordsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | RecordStatus>('all');
  const { t } = useLanguage();

  const statusLabel: Record<RecordStatus, string> = {
    Pending: t('search.form.status.pending'),
    Approved: t('search.form.status.approved'),
    Rejected: t('search.form.status.rejected'),
  };

  const filterRecords = <T extends { status?: RecordStatus } & Record<string, unknown>>(records: T[]): T[] => {
    return records.filter((record) => {
      const matchesStatus =
        selectedStatus === 'all' || record.status === selectedStatus || record.status === undefined;

      if (!searchTerm) {
        return matchesStatus;
      }

      const textMatch = Object.values(record).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return matchesStatus && textMatch;
    });
  };

  const filteredBirths =
    selectedType === 'all' || selectedType === 'birth'
      ? (filterRecords(births as (BirthRecord & Record<string, unknown>)[]) as BirthRecord[])
      : [];
  const filteredDeaths =
    selectedType === 'all' || selectedType === 'death'
      ? (filterRecords(deaths as (DeathRecord & Record<string, unknown>)[]) as DeathRecord[])
      : [];
  const filteredMarriages =
    selectedType === 'all' || selectedType === 'marriage'
      ? (filterRecords(marriages as (MarriageRecord & Record<string, unknown>)[]) as MarriageRecord[])
      : [];
  const filteredDivorces =
    selectedType === 'all' || selectedType === 'divorce'
      ? (filterRecords(divorces as (DivorceRecord & Record<string, unknown>)[]) as DivorceRecord[])
      : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
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
                  <tr key={record.birth_regno} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{record.birth_regno}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.child_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{record.date_of_birth}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {record.mother_name} & {record.father_name}
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
                      <button
                        onClick={() => onViewCertificate('birth', record)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        {t('search.table.action.viewCertificate')}
                      </button>
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
                  <tr key={record.death_regno} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{record.death_regno}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.name}</td>
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
                      <button
                        onClick={() => onViewCertificate('death', record)}
                        className="text-slate-700 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        {t('search.table.action.viewCertificate')}
                      </button>
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
                  <tr key={record.marriage_regno} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{record.marriage_regno}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.husband_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.wife_name}</td>
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
                      <button
                        onClick={() => onViewCertificate('marriage', record)}
                        className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        {t('search.table.action.viewCertificate')}
                      </button>
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
                  <tr key={record.divorce_regno} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{record.divorce_regno}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.husband_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.wife_name}</td>
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
                      <button
                        onClick={() => onViewCertificate('divorce', record)}
                        className="text-amber-600 hover:text-amber-700 flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        {t('search.table.action.viewCertificate')}
                      </button>
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
