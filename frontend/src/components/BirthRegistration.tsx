import { useState, useEffect, FormEvent } from 'react';
import { CheckCircle, Save } from 'lucide-react';
import { BirthCreatePayload, BirthRecord } from '../types';
import { useLanguage } from '../LanguageContext';
import { splitFullName } from '../utils/names';

interface BirthRegistrationProps {
  onSubmit: (record: BirthCreatePayload) => Promise<BirthRecord>;
  initialRecord?: BirthRecord | null;
  onComplete?: () => void;
}

const defaultForm = (): BirthCreatePayload => ({
  child_first_name: '',
  child_middle_name: '',
  child_last_name: '',
  mother_first_name: '',
  mother_middle_name: '',
  mother_last_name: '',
  father_first_name: '',
  father_middle_name: '',
  father_last_name: '',
  child_name: '',
  mother_name: '',
  father_name: '',
  date_of_birth: '',
  sex: 'Male',
  city: 'Jimma',
  kebele: 'Hermata Merkato',
  house_number: '',
  nationality: 'Ethiopian',
  registration_date: new Date().toISOString().split('T')[0],
});

function recordToForm(r: BirthRecord): BirthCreatePayload {
  if (r.child_first_name?.trim() && r.child_last_name?.trim()) {
    return {
      child_first_name: r.child_first_name ?? '',
      child_middle_name: r.child_middle_name ?? '',
      child_last_name: r.child_last_name ?? '',
      mother_first_name: r.mother_first_name ?? '',
      mother_middle_name: r.mother_middle_name ?? '',
      mother_last_name: r.mother_last_name ?? '',
      father_first_name: r.father_first_name ?? '',
      father_middle_name: r.father_middle_name ?? '',
      father_last_name: r.father_last_name ?? '',
      child_name: r.child_name,
      mother_name: r.mother_name,
      father_name: r.father_name,
      date_of_birth: r.date_of_birth,
      sex: r.sex,
      city: r.city,
      kebele: r.kebele,
      house_number: r.house_number ?? '',
      nationality: r.nationality,
      registration_date: r.registration_date,
    };
  }
  const c = splitFullName(r.child_name);
  const m = splitFullName(r.mother_name);
  const f = splitFullName(r.father_name);
  return {
    child_first_name: c.first_name,
    child_middle_name: c.middle_name,
    child_last_name: c.last_name === '-' ? '' : c.last_name,
    mother_first_name: m.first_name,
    mother_middle_name: m.middle_name,
    mother_last_name: m.last_name === '-' ? '' : m.last_name,
    father_first_name: f.first_name,
    father_middle_name: f.middle_name,
    father_last_name: f.last_name === '-' ? '' : f.last_name,
    child_name: r.child_name,
    mother_name: r.mother_name,
    father_name: r.father_name,
    date_of_birth: r.date_of_birth,
    sex: r.sex,
    city: r.city,
    kebele: r.kebele,
    house_number: r.house_number ?? '',
    nationality: r.nationality,
    registration_date: r.registration_date,
  };
}

function NameBlock({
  title,
  prefix,
  formData,
  onChange,
  t,
}: {
  title: string;
  prefix: 'child' | 'mother' | 'father';
  formData: BirthCreatePayload;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  t: (k: string) => string;
}) {
  const f = `${prefix}_first_name` as keyof BirthCreatePayload;
  const m = `${prefix}_middle_name` as keyof BirthCreatePayload;
  const l = `${prefix}_last_name` as keyof BirthCreatePayload;
  return (
    <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/50">
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {t('common.form.firstName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name={f}
            required
            maxLength={15}
            value={(formData[f] as string) ?? ''}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {t('common.form.middleName')} {t('common.form.optional')}
          </label>
          <input
            type="text"
            name={m}
            maxLength={15}
            value={(formData[m] as string) ?? ''}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {t('common.form.lastName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name={l}
            required
            maxLength={15}
            value={(formData[l] as string) ?? ''}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export function BirthRegistration({ onSubmit, initialRecord, onComplete }: BirthRegistrationProps) {
  const { t } = useLanguage();
  const isEdit = Boolean(initialRecord?.id);
  const [formData, setFormData] = useState<BirthCreatePayload>(defaultForm);
  const [lastCreated, setLastCreated] = useState<BirthRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRecord) {
      setFormData(recordToForm(initialRecord));
    } else {
      setFormData(defaultForm());
    }
  }, [initialRecord]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: BirthCreatePayload = {
        ...formData,
        child_middle_name: formData.child_middle_name?.trim() || undefined,
        mother_middle_name: formData.mother_middle_name?.trim() || undefined,
        father_middle_name: formData.father_middle_name?.trim() || undefined,
        house_number: formData.house_number?.trim() || undefined,
      };
      const created = await onSubmit(payload);
      setLastCreated(created);
      if (isEdit && onComplete) {
        setTimeout(() => onComplete(), 1500);
      } else {
        setFormData(defaultForm());
        setTimeout(() => setLastCreated(null), 4000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (lastCreated) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {isEdit ? t('common.form.updateSuccess') : t('birth.form.successTitle')}
        </h3>
        <p className="text-slate-600">
          {t('certificate.field.registrationNumber')}: {lastCreated.birth_regno}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <NameBlock title={t('birth.form.section.child')} prefix="child" formData={formData} onChange={handleChange} t={t} />
          <NameBlock title={t('birth.form.section.mother')} prefix="mother" formData={formData} onChange={handleChange} t={t} />
          <NameBlock title={t('birth.form.section.father')} prefix="father" formData={formData} onChange={handleChange} t={t} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('birth.form.dateOfBirth')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date_of_birth"
              required
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('birth.form.sex')} <span className="text-red-500">*</span>
            </label>
            <select
              name="sex"
              required
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('birth.form.nationality')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nationality"
              required
              maxLength={15}
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('birth.form.registrationDate')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="registration_date"
              required
              value={formData.registration_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? '…' : isEdit ? t('common.form.saveChanges') : t('birth.form.registerButton')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BirthRegistration;
