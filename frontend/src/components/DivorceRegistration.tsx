import { useState, FormEvent } from 'react';
import { CheckCircle, Save } from 'lucide-react';
import { DivorceRecord } from '../types';
import { useLanguage } from '../LanguageContext';

interface DivorceRegistrationProps {
  onSubmit: (record: DivorceRecord) => void;
}

export function DivorceRegistration({ onSubmit }: DivorceRegistrationProps) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<DivorceRecord>({
    divorce_regno: '',
    husband_name: '',
    husband_age: 18,
    husband_nationality: 'Ethiopian',
    wife_name: '',
    wife_age: 18,
    wife_nationality: 'Ethiopian',
    date_of_divorce: '',
    requester: 'Both',
    city: 'Jimma',
    kebele: 'Hermata Merkato',
    house_number: '',
    registration_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const regNo = `DIV-${Date.now()}`;
    const completeRecord = { ...formData, divorce_regno: regNo };
    onSubmit(completeRecord);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        divorce_regno: '',
        husband_name: '',
        husband_age: 18,
        husband_nationality: 'Ethiopian',
        wife_name: '',
        wife_age: 18,
        wife_nationality: 'Ethiopian',
        date_of_divorce: '',
        requester: 'Both',
        city: 'Jimma',
        kebele: 'Hermata Merkato',
        house_number: '',
        registration_date: new Date().toISOString().split('T')[0],
      });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {t('divorce.form.successTitle')}
        </h3>
        <p className="text-slate-600">
          {t('certificate.field.registrationNumber')}: {formData.divorce_regno}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-slate-200 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {t('divorce.form.husbandSection')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('divorce.form.fullName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="husband_name"
                required
                value={formData.husband_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('divorce.form.age')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="husband_age"
                required
                min="18"
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
                value={formData.husband_nationality}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {t('divorce.form.wifeSection')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('divorce.form.fullName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="wife_name"
                required
                value={formData.wife_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('divorce.form.age')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="wife_age"
                required
                min="18"
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
              <option value="Both">{t('divorce.form.requester.both')}</option>
            </select>
          </div>
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
                {t('common.form.houseNumber')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="house_number"
                required
                value={formData.house_number}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {t('divorce.form.registerButton')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DivorceRegistration;
