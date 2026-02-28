import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Search, Edit, Eye } from 'lucide-react';

interface Person {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: 'male' | 'female';
  date_of_birth?: string;
  place_of_birth?: string;
  phone?: string;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const PersonList: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPersons = async (page = 1, searchTerm = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: searchTerm
      });

      const response = await fetch(`/api/person?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPersons(data.persons);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching persons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons(currentPage, search);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPersons(1, search);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getFullName = (person: Person) => {
    return [person.first_name, person.middle_name, person.last_name]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Persons</h1>
          <p className="text-gray-600 mt-1">Manage registered persons in the system</p>
        </div>
        <Link
          to="/persons/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Persons Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : persons.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Place of Birth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {persons.map((person) => (
                    <tr key={person.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {getFullName(person)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          person.gender === 'male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {person.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(person.date_of_birth)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {person.place_of_birth || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {person.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/persons/${person.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                    disabled={currentPage === pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No persons found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Try adjusting your search terms.' : 'Get started by adding a new person.'}
            </p>
            {!search && (
              <div className="mt-6">
                <Link
                  to="/persons/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Person
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonList;