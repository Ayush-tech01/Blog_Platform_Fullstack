import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch {}
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--ink-3)', fontSize: '14px' }}>Sign in to continue reading and writing</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '8px' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--ink-3)' }}>
          New to Inkwell? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Create an account</Link>
        </p>

        {/* <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--paper-2)', borderRadius: '6px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ink-2)' }}>Demo accounts:</strong><br />
          Admin: admin@inkwell.com / admin123<br />
          Author: author@inkwell.com / demo123<br />
          Reader: reader@inkwell.com / demo123
        </div> */}
      </div>
    </div>
  )
}
