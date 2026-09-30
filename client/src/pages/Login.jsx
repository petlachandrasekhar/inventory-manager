import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/authContext'
import LiveStatus from '../components/LiveStatus'

const getApiError = (error) => error.response?.data?.message || 'Unable to log in. Please try again.'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }

    try {
      setSubmitting(true)
      await login(form)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-layout theme-login"><div className="auth-aura auth-aura-one" /><div className="auth-aura auth-aura-two" /><section className="auth-panel"><Link className="auth-brand" to="/"><span className="nav-mark"><span>C</span></span><span>Chandu <strong>Inventory360</strong><small>SMART STOCK CONTROL</small></span></Link><div className="auth-status-row"><LiveStatus /></div><p className="kicker">Chandu Inventory360</p><h1>Welcome back</h1><p className="subtitle">Sign in to keep your stock moving.</p>
        <form onSubmit={handleSubmit} noValidate><label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" /></label><label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="auth-button" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button></form>
        <p className="switch-auth">New to Chandu Inventory360? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  )
}