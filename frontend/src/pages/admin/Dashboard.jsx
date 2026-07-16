import { useState, useEffect } from 'react';
import API from '../../api/axios';
import MetricCard from '../../components/common/MetricCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { HiBookOpen, HiCube, HiCollection, HiUsers } from 'react-icons/hi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard — GourmetCraft Admin';
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/api/dashboard/stats');
      setStats(res.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Welcome to GourmetCraft</h2>
        <p className="text-emerald-100 mt-1 text-sm">
          Here's an overview of your recipe management system
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<HiBookOpen className="w-6 h-6" />}
          label="Total Recipes"
          value={stats?.totalRecipes}
          color="emerald"
          delay="delay-75"
        />
        <MetricCard
          icon={<HiCube className="w-6 h-6" />}
          label="Total Ingredients"
          value={stats?.totalIngredients}
          color="blue"
          delay="delay-150"
        />
        <MetricCard
          icon={<HiCollection className="w-6 h-6" />}
          label="Total Menus"
          value={stats?.totalMenus}
          color="amber"
          delay="delay-225"
        />
        <MetricCard
          icon={<HiUsers className="w-6 h-6" />}
          label="Active Users"
          value={stats?.activeUsers}
          color="purple"
          delay="delay-300"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
