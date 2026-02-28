]import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Baby, 
  Cross, 
  Heart, 
  UserX, 
  Plus,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

interface Stats {
  totalPersons: number;
  totalBirths: number;
  totalDeaths: number;
  totalMarriages: number;
  totalDivorces: number;
  recentBirths: number;
  recentDeaths: number;
  recentMarriages: number;
  recentDivorces: number;
}

interface Activity {
  type: string;
  id: string;
  certificate_number: string;
  registration_date: string;
  name: string;
  registered_by: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch stats with error handling
        try {
          const statsRes = await fetch('/api/dashboard/stats', { headers });
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
          // Set default stats if API fails
          setStats({
            totalPersons: 0,
            totalBirths: 0,
            totalDeaths: 0,
            totalMarriages: 0,
            totalDivorces: 0,
            recentBirths: 0,
            recentDeaths: 0,
            recentMarriages: 0,
            recentDivorces: 0
          });
        }

        // Fetch activities with error handling
        try {
          const activitiesRes = await fetch('/api/dashboard/recent', { headers });
          if (activitiesRes.ok) {
            const activitiesData = await activitiesRes.json();
            setActivities(activitiesData);
          }
        } catch (error) {
          console.error('Error fetching activities:', error);
          setActivities([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values if everything fails
        setStats({
          totalPersons: 0,
          totalBirths: 0,
          totalDeaths: 0,
          totalMarriages: 0,
          totalDivorces: 0,
          recentBirths: 0,
          recentDeaths: 0,
          recentMarriages: 0,
          recentDivorces: 0
        });
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    { name: 'Register Birth', href: '/births/new', icon: Baby, color: 'bg-blue-500' },
    { name: 'Register Death', href: '/deaths/new', icon: Cross, color: 'bg-gray-500' },
    { name: 'Register Marriage', href: '/marriages/new', icon: Heart, color: 'bg-pink-500' },
    { name: 'Register Divorce', href: '/divorces/new', icon: UserX, color: 'bg-red-500' },
    { name: 'Add Person', href: '/persons/new', icon: Users, color: 'bg-green-500' },
  ];

  const statCards = stats ? [
    { name: 'Total Persons', value: stats.totalPersons, recent: 0, icon: Users, color: 'bg-green-500' },
    { name: 'Birth Records', value: stats.totalBirths, recent: stats.recentBirths, icon: Baby, color: 'bg-blue-500' },
    { name: 'Death Records', value: stats.totalDeaths, recent: stats.recentDeaths, icon: Cross, color: 'bg-gray-500' },
    { name: 'Marriage Records', value: stats.totalMarriages, recent: stats.recentMarriages, icon: Heart, color: 'bg-pink-500' },
    { name: 'Divorce Records', value: stats.totalDivorces, recent: stats.recentDivorces, icon: UserX, color: 'bg-red-500' },
  ] : [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'birth': return Baby;
      case 'death': return Cross;
      case 'marriage': return Heart;
      case 'divorce': return UserX;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'birth': return 'text-blue-600 bg-blue-100';
      case 'death': return 'text-gray-600 bg-gray-100';
      case 'marriage': return 'text-pink-600 bg-pink-100';
      case 'divorce': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.fullName}! Here's an overview of the vital events registration system.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                {stat.recent > 0 && (
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +{stat.recent} this month
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.length > 0 ? (
            activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={index} className="px-6 py-4 flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      New {activity.type} record for {activity.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Certificate: {activity.certificate_number} • Registered by {activity.registered_by}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(activity.registration_date).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activities found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;