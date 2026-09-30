import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/authContext'
import LiveStatus from '../components/LiveStatus'

const getApiError = (error) => error.response?.data?.message || 'Unable to create your account. Please try again.'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setSubmitting(true)
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-layout theme-login"><div className="auth-aura auth-aura-one" /><div className="auth-aura auth-aura-two" /><section className="auth-panel"><Link className="auth-brand" to="/"><span className="nav-mark"><span>C</span></span><span>Chandu <strong>Inventory360</strong><small>SMART STOCK CONTROL</small></span></Link><div className="auth-status-row"><LiveStatus /></div><p className="kicker">Chandu Inventory360</p><h1>Create your account</h1><p className="subtitle">Start with a clear view of every item.</p>
      <form onSubmit={handleSubmit} noValidate><label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" /></label><label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" /></label><label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="new-password" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="auth-button" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button></form>
      <p className="switch-auth">Already have an account? <Link to="/login">Sign in</Link></p>
    </section></main>
  )
}