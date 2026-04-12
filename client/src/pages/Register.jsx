import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'reader' })
  const { register, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    try {
      await register(form.name, form.email, form.password, form.role)
      navigate('/dashboard')
    } catch {}
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>Join Inkwell</h1>
          <p style={{ color: 'var(--ink-3)', fontSize: '14px' }}>Your stories deserve an audience</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input placeholder="Jane Doe" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="At least 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>

          <div className="form-group">
            <label>I want to</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
              {[
                { role: 'reader', icon: '📖', label: 'Read stories', desc: 'Discover and save posts' },
                { role: 'author', icon: '✍️', label: 'Write stories', desc: 'Publish and grow' },
              ].map(({ role, icon, label, desc }) => (
                <button key={role} type="button" onClick={() => setForm({ ...form, role })}
                  style={{
                    padding: '14px 12px', borderRadius: '8px', border: '2px solid',
                    borderColor: form.role === role ? 'var(--ink)' : 'var(--paper-3)',
                    background: form.role === role ? 'var(--ink)' : '#fff',
                    color: form.role === role ? 'var(--paper)' : 'var(--ink-2)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px' }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--ink-3)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
