import { useState, useEffect, FormEvent } from 'react';
import { CheckCircle, Save } from 'lucide-react';
import { DivorceCreatePayload, DivorceRecord, MarriageRecord } from '../types';
import { useLanguage } from '../LanguageContext';
import { splitFullName, displaySpouseName } from '../utils/names';

interface DivorceRegistrationProps {
  onSubmit: (record: DivorceCreatePayload) => Promise<DivorceRecord>;
  marriages: MarriageRecord[];
  initialRecord?: DivorceRecord | null;
  onComplete?: () => void;
}

const defaultForm = (): DivorceCreatePayload => ({
  husband_first_name: '',
  husband_middle_name: '',
  husband_last_name: '',
  husband_name: '',
  husband_age: 18,
  husband_nationality: 'Ethiopian',
  wife_first_name: '',
  wife_middle_name: '',
  wife_last_name: '',
  wife_name: '',
  wife_age: 18,
  wife_nationality: 'Ethiopian',
  date_of_divorce: '',
  requester: 'Mutual',
  city: 'Jimma',
  kebele: 'Hermata Merkato',
  house_number: '',
  registration_date: new Date().toISOString().split('T')[0],
});

function recordToForm(r: DivorceRecord): DivorceCreatePayload {
  const h =
    r.husband_first_name?.trim() && r.husband_last_name?.trim()
      ? {
          husband_first_name: r.husband_first_name ?? '',
          husband_middle_name: r.husband_middle_name ?? '',
          husband_last_name: r.husband_last_name ?? '',
        }
      : (() => {
          const s = splitFullName(r.husband_name);
          return {
            husband_first_name: s.first_name,
            husband_middle_name: s.middle_name,
            husband_last_name: s.last_name === '-' ? '' : s.last_name,
          };
        })();
  const w =
    r.wife_first_name?.trim() && r.wife_last_name?.trim()
      ? {
          wife_first_name: r.wife_first_name ?? '',
          wife_middle_name: r.wife_middle_name ?? '',
          wife_last_name: r.wife_last_name ?? '',
        }
      : (() => {
          const s = splitFullName(r.wife_name);
          return {
            wife_first_name: s.first_name,
            wife_middle_name: s.middle_name,
            wife_last_name: s.last_name === '-' ? '' : s.last_name,
          };
        })();
  return {
    ...h,
    ...w,
    husband_name: r.husband_name,
    wife_name: r.wife_name,
    husband_age: r.husband_age,
    husband_nationality: r.husband_nationality,
    wife_age: r.wife_age,
    wife_nationality: r.wife_nationality,
    date_of_divorce: r.date_of_divorce,
    requester: r.requester,
    city: r.city,
    kebele: r.kebele,
    house_number: r.house_number ?? '',
    registration_date: r.registration_date,
    marriage_id: r.marriage_id ?? undefined,
  };
}

export function DivorceRegistration({
  onSubmit,
  marriages,
  initialRecord,
  onComplete,
}: DivorceRegistrationProps) {
  const { t } = useLanguage();
  const isEdit = Boolean(initialRecord?.id);
  const [formData, setFormData] = useState<DivorceCreatePayload>(defaultForm());
  const [marriageLink, setMarriageLink] = useState('');
  const [lastCreated, setLastCreated] = useState<DivorceRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRecord) {
      setFormData(recordToForm(initialRecord));
      setMarriageLink(initialRecord.marriage_id ?? '');
    } else {
      setFormData(defaultForm());
      setMarriageLink('');
    }
  }, [initialRecord]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: DivorceCreatePayload = {
        ...formData,
        husband_middle_name: formData.husband_middle_name?.trim() || undefined,
        wife_middle_name: formData.wife_middle_name?.trim() || undefined,
        house_number: formData.house_number?.trim() || undefined,
        marriage_id: marriageLink.trim() || undefined,
      };
      const created = await onSubmit(payload);
      setLastCreated(created);
      if (isEdit && onComplete) setTimeout(() => onComplete(), 1500);
      else {
        setFormData(defaultForm());
        setMarriageLink('');
        setTimeout(() => setLastCreated(null), 4000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  if (lastCreated) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {isEdit ? t('common.form.updateSuccess') : t('divorce.form.successTitle')}
        </h3>
        <p className="text-slate-600">
          {t('certificate.field.registrationNumber')}: {lastCreated.divorce_regno}
        </p>
      </div>
    );
  }

  const nameRow = (side: 'husband' | 'wife') => (
    <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/50 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {t('common.form.firstName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name={`${side}_first_name`}
            required
            maxLength={15}
            value={String((formData as unknown as Record<string, string | undefined>)[`${side}_first_name`] ?? '')}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {t('common.form.middleName')} {t('common.form.optional')}
          </label>
          <input
            type="text"
            name={`${side}_middle_name`}
            maxLength={15}
            value={String((formData as unknown as Record<string, string | undefined>)[`${side}_middle_name`] ?? '')}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {t('common.form.lastName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name={`${side}_last_name`}
            required
            maxLength={15}
            value={String((formData as unknown as Record<string, string | undefined>)[`${side}_last_name`] ?? '')}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <div className="border-b border-slate-200 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('divorce.form.husbandSection')}</h3>
          {nameRow('husband')}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('divorce.form.age')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="husband_age"
                required
                min={18}
                value={formData.husband_age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('divorce.form.nationality')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="husband_nationality"
                required
                maxLength={15}
                value={formData.husband_nationality}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('divorce.form.wifeSection')}</h3>
          {nameRow('wife')}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('divorce.form.age')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="wife_age"
                required
                min={18}
                value={formData.wife_age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('divorce.form.nationality')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="wife_nationality"
                required
                maxLength={15}
                value={formData.wife_nationality}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('divorce.form.dateOfDivorce')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date_of_divorce"
              required
              value={formData.date_of_divorce}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('divorce.form.registrationDate')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="registration_date"
              required
              value={formData.registration_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('divorce.form.requester')} <span className="text-red-500">*</span>
            </label>
            <select
              name="requester"
              required
              value={formData.requester}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="Husband">{t('divorce.form.requester.husband')}</option>
              <option value="Wife">{t('divorce.form.requester.wife')}</option>
              <option value="Mutual">{t('divorce.form.requester.mutual')}</option>
              <option value="Both">{t('divorce.form.requester.both')}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('divorce.form.linkedMarriage')}
            </label>
            <select
              value={marriageLink}
              onChange={(e) => setMarriageLink(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">{t('divorce.form.linkedMarriage.none')}</option>
              {marriages
                .filter((m) => m.id)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.marriage_regno} — {displaySpouseName('husband', m)} / {displaySpouseName('wife', m)}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('common.form.addressSection')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('common.form.city')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('common.form.kebele')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kebele"
                required
                value={formData.kebele}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('common.form.houseNumber')} {t('common.form.optional')}
              </label>
              <input
                type="text"
                name="house_number"
                value={formData.house_number ?? ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {submitting ? '…' : isEdit ? t('common.form.saveChanges') : t('divorce.form.registerButton')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DivorceRegistration;
