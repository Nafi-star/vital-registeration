import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Save, ArrowLeft, Search } from 'lucide-react';

interface Person {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: string;
  date_of_birth?: string;
}

interface BirthFormData {
  personId: string;
  certificateNumber: string;
  registrationDate: string;
  motherName: string;
  fatherName: string;
  motherNationality: string;
  fatherNationality: string;
  birthWeight: string;
}

const BirthForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<BirthFormData>({
    personId: '',
    certificateNumber: '',
    registrationDate: new Date().toISOString().split('T')[0],
    motherName: '',
    fatherName: '',
    motherNationality: 'Ethiopian',
    fatherNationality: 'Ethiopian',
    birthWeight: ''
  });
  
  const [persons, setPersons] = useState<Person[]>([]);
  const [personSearch, setPersonSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (personSearch.length >= 2) {
      searchPersons(personSearch);
    } else {
      setPersons([]);
    }
  }, [personSearch]);

  const searchPersons = async (search: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/person?search=${encodeURIComponent(search)}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPersons(data.persons);
      }
    } catch (error) {
      console.error('Error searching persons:', error);
    }
  };

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setFormData(prev => ({ ...prev, personId: person.id }));
    setPersonSearch(getPersonFullName(person));
    setPersons([]);
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
      const response = await fetch('/api/birth', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          birthWeight: formData.birthWeight ? parseFloat(formData.birthWeight) : null
        })
      });

      if (response.ok) {
        navigate('/births');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register birth');
      }
    } catch (error) {
      console.error('Error registering birth:', error);
      setError('Failed to register birth');
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
          onClick={() => navigate('/births')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Birth Records
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register New Birth</h1>
          <p className="text-gray-600 mt-1">Create a new birth certificate record</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Baby className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Birth Registration Form</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Person Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search for Person *
            </label>
            <div className="relative">
              <input
                type="text"
                value={personSearch}
                onChange={(e) => setPersonSearch(e.target.value)}
                placeholder="Type to search for a person..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                required={!selectedPerson}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              
              {persons.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {persons.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => selectPerson(person)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="font-medium text-gray-900">
                        {getPersonFullName(person)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {person.gender} • {person.date_of_birth ? new Date(person.date_of_birth).toLocaleDateString() : 'No DOB'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {selectedPerson && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {getPersonFullName(selectedPerson)} 
                  ({selectedPerson.gender}, {selectedPerson.date_of_birth ? new Date(selectedPerson.date_of_birth).toLocaleDateString() : 'No DOB'})
                </p>
              </div>
            )}
          </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="BC-2024-001"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Parent Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Full Name *
              </label>
              <input
                type="text"
                name="motherName"
                required
                value={formData.motherName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Full Name *
              </label>
              <input
                type="text"
                name="fatherName"
                required
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Nationality
              </label>
              <input
                type="text"
                name="motherNationality"
                value={formData.motherNationality}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Nationality
              </label>
              <input
                type="text"
                name="fatherNationality"
                value={formData.fatherNationality}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Weight (kg)
            </label>
            <input
              type="number"
              name="birthWeight"
              step="0.01"
              min="0"
              max="10"
              value={formData.birthWeight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="3.5"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/births')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedPerson}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Registering...' : 'Register Birth'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirthForm;