import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext.jsx'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import LowStock from './pages/LowStock'
import Login from './pages/Login'
import Register from './pages/Register'
import Suppliers from './pages/Suppliers'
import './App.css'

function AppRoutes() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/low-stock" element={<LowStock />} /><Route path="/suppliers" element={<Suppliers />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>
}

function App() {
  return <BrowserRouter><AuthProvider><Toaster position="top-right" toastOptions={{ duration: 3200 }} /><AppRoutes /></AuthProvider></BrowserRouter>
}

export default App
