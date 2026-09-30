import { Link, NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/authContext'
import LiveStatus from './LiveStatus'

export default function AppNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return <nav className="app-nav"><Link className="nav-brand" to="/dashboard"><span className="nav-mark"><span>C</span></span><span>Chandu <strong>Inventory360</strong><small>SMART STOCK CONTROL</small></span></Link><div className="nav-links"><NavLink to="/dashboard">Inventory</NavLink><NavLink to="/low-stock">Low stock</NavLink><NavLink to="/suppliers">Suppliers</NavLink></div><div className="nav-user"><LiveStatus /><span className="user-orb">{user.name.slice(0, 1).toUpperCase()}</span><span>{user.name}</span><button className="text-button" onClick={handleLogout}>Log out</button></div></nav>
}