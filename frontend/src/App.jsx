import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import AdminLayout from './components/layout/AdminLayout'
import UserLayout from './components/layout/UserLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/admin/Dashboard'
import MenuManagement from './pages/admin/MenuManagement'
import SubMenuManagement from './pages/admin/SubMenuManagement'
import IngredientMaster from './pages/admin/IngredientMaster'
import RecipeManagement from './pages/admin/RecipeManagement'
import CreateRecipe from './pages/admin/CreateRecipe'
import UserDashboard from './pages/user/Dashboard'
import UserRecipes from './pages/user/Recipes'
import RecipeDetails from './pages/user/RecipeDetails'
import Calculator from './pages/user/Calculator'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="menus" element={<MenuManagement />} />
          <Route path="submenus" element={<SubMenuManagement />} />
          <Route path="ingredients" element={<IngredientMaster />} />
          <Route path="recipes" element={<RecipeManagement />} />
          <Route path="recipes/create" element={<CreateRecipe />} />
          <Route path="recipes/edit/:id" element={<CreateRecipe />} />
          <Route path="recipes/:id" element={<RecipeDetails />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="recipes" element={<UserRecipes />} />
          <Route path="recipes/:id" element={<RecipeDetails />} />
          <Route path="calculator" element={<Calculator />} />
        </Route>

        {/* Global Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
