import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './routes/PrivateRoute'
import PublicRoute from './routes/PublicRoute'
import AdminRoute from './routes/AdminRoute'

// Views
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import Products from './views/Products'
import ProductDetail from './views/ProductDetail'
import Cart from './views/Cart'
import Profile from './views/Profile'

// Admin Views
import AdminDashboard from './views/admin/Dashboard'
import AdminUsers from './views/admin/Users'
import AdminProducts from './views/admin/Products'
import AdminComments from './views/admin/Comments'
import AdminEvaluations from './views/admin/Evaluations'


export default function App() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          
          {/* Rutas de autenticación (solo para no autenticados) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Rutas privadas (requieren autenticación) */}
          <Route 
            path="/cart" 
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />

          {/* Rutas de administrador */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/comments" 
            element={
              <AdminRoute>
                <AdminComments />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/evaluations" 
            element={
              <AdminRoute>
                <AdminEvaluations />
              </AdminRoute>
            } 
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  )
}