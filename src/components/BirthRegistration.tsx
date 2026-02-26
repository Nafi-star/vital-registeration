import { useState, FormEvent } from 'react';
import { CheckCircle, Save } from 'lucide-react';
import { BirthRecord } from '../types';
import { useLanguage } from '../LanguageContext';

interface BirthRegistrationProps {
  onSubmit: (record: BirthRecord) => void;
}

export function BirthRegistration({ onSubmit }: BirthRegistrationProps) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<BirthRecord>({
    birth_regno: '',
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const regNo = `BRT-${Date.now()}`;
    const completeRecord = { ...formData, birth_regno: regNo };
    onSubmit(completeRecord);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        birth_regno: '',
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
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {t('birth.form.successTitle')}
        </h3>
        <p className="text-slate-600">
          {t('certificate.field.registrationNumber')}: {formData.birth_regno}
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
              {t('birth.form.childName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="child_name"
              required
              value={formData.child_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('birth.form.motherName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mother_name"
              required
              value={formData.mother_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('birth.form.fatherName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="father_name"
              required
              value={formData.father_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {t('birth.form.registerButton')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BirthRegistration;
