import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Save, ArrowLeft, Search } from 'lucide-react';

interface Person {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: string;
  date_of_birth?: string;
}

interface MarriageFormData {
  certificateNumber: string;
  husbandId: string;
  wifeId: string;
  marriageDate: string;
  placeOfMarriage: string;
  marriageType: 'civil' | 'religious' | 'traditional';
  witness1Name: string;
  witness2Name: string;
  registrationDate: string;
}

const MarriageForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<MarriageFormData>({
    certificateNumber: '',
    husbandId: '',
    wifeId: '',
    marriageDate: '',
    placeOfMarriage: '',
    marriageType: 'civil',
    witness1Name: '',
    witness2Name: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });
  
  const [husbandSearch, setHusbandSearch] = useState('');
  const [wifeSearch, setWifeSearch] = useState('');
  const [husbandResults, setHusbandResults] = useState<Person[]>([]);
  const [wifeResults, setWifeResults] = useState<Person[]>([]);
  const [selectedHusband, setSelectedHusband] = useState<Person | null>(null);
  const [selectedWife, setSelectedWife] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (husbandSearch.length >= 2) {
      searchPersons(husbandSearch, 'male', setHusbandResults);
    } else {
      setHusbandResults([]);
    }
  }, [husbandSearch]);

  useEffect(() => {
    if (wifeSearch.length >= 2) {
      searchPersons(wifeSearch, 'female', setWifeResults);
    } else {
      setWifeResults([]);
    }
  }, [wifeSearch]);

  const searchPersons = async (search: string, gender: string, setResults: React.Dispatch<React.SetStateAction<Person[]>>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/person?search=${encodeURIComponent(search)}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const filteredPersons = data.persons.filter((person: Person) => person.gender === gender);
        setResults(filteredPersons);
      }
    } catch (error) {
      console.error('Error searching persons:', error);
    }
  };

  const selectHusband = (person: Person) => {
    setSelectedHusband(person);
    setFormData(prev => ({ ...prev, husbandId: person.id }));
    setHusbandSearch(getPersonFullName(person));
    setHusbandResults([]);
  };

  const selectWife = (person: Person) => {
    setSelectedWife(person);
    setFormData(prev => ({ ...prev, wifeId: person.id }));
    setWifeSearch(getPersonFullName(person));
    setWifeResults([]);
  };

  const getPersonFullName = (person: Person) => {
    return [person.first_name, person.middle_name, person.last_name]
      .filter(Boolean)
      .join(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/marriage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/marriages');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register marriage');
      }
    } catch (error) {
      console.error('Error registering marriage:', error);
      setError('Failed to register marriage');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/marriages')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Marriage Records
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register New Marriage</h1>
          <p className="text-gray-600 mt-1">Create a new marriage certificate record</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-pink-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Marriage Registration Form</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Certificate Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Number *
              </label>
              <input
                type="text"
                name="certificateNumber"
                required
                value={formData.certificateNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="MC-2024-001"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Spouse Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Husband Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search for Husband *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={husbandSearch}
                  onChange={(e) => setHusbandSearch(e.target.value)}
                  placeholder="Type to search for husband..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-10"
                  required={!selectedHusband}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                
                {husbandResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {husbandResults.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => selectHusband(person)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <div className="font-medium text-gray-900">
                          {getPersonFullName(person)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {person.date_of_birth ? new Date(person.date_of_birth).toLocaleDateString() : 'No DOB'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedHusband && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected Husband:</strong> {getPersonFullName(selectedHusband)}
                  </p>
                </div>
              )}
            </div>

            {/* Wife Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search for Wife *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={wifeSearch}
                  onChange={(e) => setWifeSearch(e.target.value)}
                  placeholder="Type to search for wife..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-10"
                  required={!selectedWife}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                
                {wifeResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {wifeResults.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => selectWife(person)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <div className="font-medium text-gray-900">
                          {getPersonFullName(person)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {person.date_of_birth ? new Date(person.date_of_birth).toLocaleDateString() : 'No DOB'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedWife && (
                <div className="mt-2 p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-800">
                    <strong>Selected Wife:</strong> {getPersonFullName(selectedWife)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Marriage Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marriage Date *
              </label>
              <input
                type="date"
                name="marriageDate"
                required
                value={formData.marriageDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marriage Type *
              </label>
              <select
                name="marriageType"
                required
                value={formData.marriageType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="civil">Civil</option>
                <option value="religious">Religious</option>
                <option value="traditional">Traditional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Place of Marriage *
            </label>
            <input
              type="text"
              name="placeOfMarriage"
              required
              value={formData.placeOfMarriage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Church, Kebele Office, etc."
            />
          </div>

          {/* Witnesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Witness 1 Name
              </label>
              <input
                type="text"
                name="witness1Name"
                value={formData.witness1Name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Witness 2 Name
              </label>
              <input
                type="text"
                name="witness2Name"
                value={formData.witness2Name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/marriages')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedHusband || !selectedWife}
              className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Registering...' : 'Register Marriage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarriageForm;