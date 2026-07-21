import { useState, useEffect } from 'react'
import API from '../../api/axios'
import MetricCard from '../../components/common/MetricCard'
import { SkeletonCard } from '../../components/common/Skeleton'
import { HiBookOpen, HiCube, HiCollection, HiUsers } from 'react-icons/hi'

const UserDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await API.get('/api/dashboard/stats')
      setStats(res.data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Dashboard — GourmetCraft'
    fetchStats()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enterprise KPI Bar */}
      <div className="flex flex-col mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} className={`delay-${i * 75}`} />
            ))
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Recent Recipes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Recipes</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipe Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Portions</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats?.recentRecipes?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No recent recipes
                    </td>
                  </tr>
                ) : (
                  stats?.recentRecipes?.map(recipe => (
                    <tr key={recipe._id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{recipe.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{recipe.menuId?.name || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{recipe.portions}</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">Active</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
