import { useState, FormEvent } from 'react';
import { CheckCircle, Save } from 'lucide-react';
import { DeathRecord } from '../types';
import { useLanguage } from '../LanguageContext';

interface DeathRegistrationProps {
  onSubmit: (record: DeathRecord) => void;
}

export function DeathRegistration({ onSubmit }: DeathRegistrationProps) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<DeathRecord>({
    death_regno: '',
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const regNo = `DTH-${Date.now()}`;
    const completeRecord = { ...formData, death_regno: regNo };
    onSubmit(completeRecord);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        death_regno: '',
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
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {t('death.form.successTitle')}
        </h3>
        <p className="text-slate-600">
          {t('certificate.field.registrationNumber')}: {formData.death_regno}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('death.form.fullName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('death.form.birthRegNo')}
            </label>
            <input
              type="text"
              name="birth_regno"
              value={formData.birth_regno}
              onChange={handleChange}
              placeholder={t('death.form.optionalHint')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
            value={formData.cause_of_death}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {t('common.form.addressSection')}
          </h3>
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('common.form.houseNumber')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="house_number"
                required
                value={formData.house_number}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {t('death.form.registerButton')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeathRegistration;
