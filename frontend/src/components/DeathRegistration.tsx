import { useState, useEffect, FormEvent } from 'react';
import { CheckCircle, Save } from 'lucide-react';
import { DeathCreatePayload, DeathRecord } from '../types';
import { useLanguage } from '../LanguageContext';
import { splitFullName } from '../utils/names';

interface DeathRegistrationProps {
  onSubmit: (record: DeathCreatePayload) => Promise<DeathRecord>;
  initialRecord?: DeathRecord | null;
  onComplete?: () => void;
}

const defaultForm = (): DeathCreatePayload => ({
  deceased_first_name: '',
  deceased_middle_name: '',
  deceased_last_name: '',
  name: '',
  date_of_birth: '',
  date_of_death: '',
  cause_of_death: '',
  sex: 'Male',
  city: 'Jimma',
  kebele: 'Hermata Merkato',
  house_number: '',
  nationality: 'Ethiopian',
  birth_regno: '',
  registration_date: new Date().toISOString().split('T')[0],
});

function recordToForm(r: DeathRecord): DeathCreatePayload {
  if (r.deceased_first_name?.trim() && r.deceased_last_name?.trim()) {
    return {
      deceased_first_name: r.deceased_first_name ?? '',
      deceased_middle_name: r.deceased_middle_name ?? '',
      deceased_last_name: r.deceased_last_name ?? '',
      name: r.name,
      date_of_birth: r.date_of_birth,
      date_of_death: r.date_of_death,
      cause_of_death: r.cause_of_death,
      sex: r.sex,
      city: r.city,
      kebele: r.kebele,
      house_number: r.house_number ?? '',
      nationality: r.nationality,
      birth_regno: r.birth_regno ?? '',
      registration_date: r.registration_date,
    };
  }
  const s = splitFullName(r.name);
  return {
    deceased_first_name: s.first_name,
    deceased_middle_name: s.middle_name,
    deceased_last_name: s.last_name === '-' ? '' : s.last_name,
    name: r.name,
    date_of_birth: r.date_of_birth,
    date_of_death: r.date_of_death,
    cause_of_death: r.cause_of_death,
    sex: r.sex,
    city: r.city,
    kebele: r.kebele,
    house_number: r.house_number ?? '',
    nationality: r.nationality,
    birth_regno: r.birth_regno ?? '',
    registration_date: r.registration_date,
  };
}

export function DeathRegistration({ onSubmit, initialRecord, onComplete }: DeathRegistrationProps) {
  const { t } = useLanguage();
  const isEdit = Boolean(initialRecord?.id);
  const [formData, setFormData] = useState<DeathCreatePayload>(defaultForm());
  const [lastCreated, setLastCreated] = useState<DeathRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRecord) setFormData(recordToForm(initialRecord));
    else setFormData(defaultForm());
  }, [initialRecord]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: DeathCreatePayload = {
        ...formData,
        deceased_middle_name: formData.deceased_middle_name?.trim() || undefined,
        house_number: formData.house_number?.trim() || undefined,
        birth_regno: formData.birth_regno?.trim() || undefined,
      };
      const created = await onSubmit(payload);
      setLastCreated(created);
      if (isEdit && onComplete) setTimeout(() => onComplete(), 1500);
      else {
        setFormData(defaultForm());
        setTimeout(() => setLastCreated(null), 4000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (lastCreated) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {isEdit ? t('common.form.updateSuccess') : t('death.form.successTitle')}
        </h3>
        <p className="text-slate-600">
          {t('certificate.field.registrationNumber')}: {lastCreated.death_regno}
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

        <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/50">
          <h4 className="text-sm font-semibold text-slate-800">{t('death.form.section.deceased')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {t('common.form.firstName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="deceased_first_name"
                required
                maxLength={15}
                value={formData.deceased_first_name ?? ''}
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
                name="deceased_middle_name"
                maxLength={15}
                value={formData.deceased_middle_name ?? ''}
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
                name="deceased_last_name"
                required
                maxLength={15}
                value={formData.deceased_last_name ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('death.form.birthRegNo')}
            </label>
            <input
              type="text"
              name="birth_regno"
              value={formData.birth_regno ?? ''}
              onChange={handleChange}
              placeholder={t('death.form.optionalHint')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('death.form.registrationDate')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="registration_date"
              required
              value={formData.registration_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('death.form.dateOfBirth')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date_of_birth"
              required
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('death.form.dateOfDeath')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date_of_death"
              required
              value={formData.date_of_death}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('death.form.sex')} <span className="text-red-500">*</span>
            </label>
            <select
              name="sex"
              required
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('death.form.nationality')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nationality"
              required
              maxLength={15}
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('death.form.causeOfDeath')} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="cause_of_death"
            required
            maxLength={20}
            value={formData.cause_of_death}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
          />
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
            className="bg-slate-700 hover:bg-slate-800 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? '…' : isEdit ? t('common.form.saveChanges') : t('death.form.registerButton')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeathRegistration;
