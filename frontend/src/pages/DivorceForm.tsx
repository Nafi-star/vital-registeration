import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserX, Save, ArrowLeft, Search } from 'lucide-react';

interface Marriage {
  id: string;
  certificate_number: string;
  husband_first_name: string;
  husband_last_name: string;
  wife_first_name: string;
  wife_last_name: string;
  marriage_date: string;
}

interface DivorceFormData {
  marriageId: string;
  certificateNumber: string;
  divorceDate: string;
  divorceType: 'mutual_consent' | 'court_order' | 'other';
  reason: string;
  registrationDate: string;
}

const DivorceForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<DivorceFormData>({
    marriageId: '',
    certificateNumber: '',
    divorceDate: '',
    divorceType: 'mutual_consent',
    reason: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });
  
  const [marriageSearch, setMarriageSearch] = useState('');
  const [marriageResults, setMarriageResults] = useState<Marriage[]>([]);
  const [selectedMarriage, setSelectedMarriage] = useState<Marriage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (marriageSearch.length >= 2) {
      searchMarriages(marriageSearch);
    } else {
      setMarriageResults([]);
    }
  }, [marriageSearch]);

  const searchMarriages = async (search: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/marriage?search=${encodeURIComponent(search)}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMarriageResults(data.marriages);
      }
    } catch (error) {
      console.error('Error searching marriages:', error);
    }
  };

  const selectMarriage = (marriage: Marriage) => {
    setSelectedMarriage(marriage);
    setFormData(prev => ({ ...prev, marriageId: marriage.id }));
    setMarriageSearch(`${marriage.husband_first_name} ${marriage.husband_last_name} & ${marriage.wife_first_name} ${marriage.wife_last_name} (${marriage.certificate_number})`);
    setMarriageResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/divorce', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/divorces');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register divorce');
      }
    } catch (error) {
      console.error('Error registering divorce:', error);
      setError('Failed to register divorce');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/divorces')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Divorce Records
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register New Divorce</h1>
          <p className="text-gray-600 mt-1">Create a new divorce certificate record</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <UserX className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Divorce Registration Form</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Marriage Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search for Marriage Record *
            </label>
            <div className="relative">
              <input
                type="text"
                value={marriageSearch}
                onChange={(e) => setMarriageSearch(e.target.value)}
                placeholder="Type to search for a marriage record..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                required={!selectedMarriage}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              
              {marriageResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {marriageResults.map((marriage) => (
                    <button
                      key={marriage.id}
                      type="button"
                      onClick={() => selectMarriage(marriage)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="font-medium text-gray-900">
                        {marriage.husband_first_name} {marriage.husband_last_name} & {marriage.wife_first_name} {marriage.wife_last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Certificate: {marriage.certificate_number} • Married: {new Date(marriage.marriage_date).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {selectedMarriage && (
              <div className="mt-2 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Selected Marriage:</strong> {selectedMarriage.husband_first_name} {selectedMarriage.husband_last_name} & {selectedMarriage.wife_first_name} {selectedMarriage.wife_last_name}
                  <br />
                  <strong>Marriage Certificate:</strong> {selectedMarriage.certificate_number}
                  <br />
                  <strong>Marriage Date:</strong> {new Date(selectedMarriage.marriage_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Certificate Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Divorce Certificate Number *
              </label>
              <input
                type="text"
                name="certificateNumber"
                required
                value={formData.certificateNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="DV-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Date *
              </label>
              <input
                type="date"
                name="registrationDate"
                required
                value={formData.registrationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {/* Divorce Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Divorce Date *
              </label>
              <input
                type="date"
                name="divorceDate"
                required
                value={formData.divorceDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Divorce Type *
              </label>
              <select
                name="divorceType"
                required
                value={formData.divorceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="mutual_consent">Mutual Consent</option>
                <option value="court_order">Court Order</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Divorce
            </label>
            <textarea
              name="reason"
              rows={4}
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Optional: Describe the reason for divorce..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/divorces')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedMarriage}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Registering...' : 'Register Divorce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DivorceForm;