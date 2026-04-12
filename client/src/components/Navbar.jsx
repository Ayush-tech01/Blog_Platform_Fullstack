import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid var(--paper-3)',
      height: '64px',
      position: 'sticky', top: 0, zIndex: 200,
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
          Inkwell
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/blog" style={{ fontSize: '14px', color: location.pathname.startsWith('/blog') ? 'var(--ink)' : 'var(--ink-3)', fontWeight: location.pathname.startsWith('/blog') ? 500 : 400 }}>
            Stories
          </Link>

          {user ? (
            <>
              {(user.role === 'author' || user.role === 'admin') && (
                <Link to="/write" className="btn btn-accent btn-sm">
                  + Write
                </Link>
              )}

              {/* Admin link in top navbar — only visible to admin */}
              {user.role === 'admin' && (
                <Link to="/admin" style={{
                  fontSize: '14px',
                  color: location.pathname.startsWith('/admin') ? 'var(--ink)' : 'var(--ink-3)',
                  fontWeight: location.pathname.startsWith('/admin') ? 500 : 400,
                }}>
                  Admin
                </Link>
              )}

              <div style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(!menuOpen)}
                  style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px' }}>
                  <div className="avatar-circle" style={{ width: '34px', height: '34px', fontSize: '13px' }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : initials}
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--ink-2)' }}>{user.name.split(' ')[0]}</span>
                </button>

                {menuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: '8px',
                    background: '#fff', border: '1px solid var(--paper-3)',
                    borderRadius: 'var(--radius)', minWidth: '180px',
                    boxShadow: 'var(--shadow)', zIndex: 300,
                  }} onClick={() => setMenuOpen(false)}>
                    {[
                      { label: 'Dashboard', to: '/dashboard' },
                      { label: 'Saved Posts', to: '/saved' },
                      ...(user.role === 'author' || user.role === 'admin' ? [{ label: 'Write Story', to: '/write' }] : []),
                      ...(user.role === 'admin' ? [{ label: 'Admin Panel', to: '/admin' }] : []),
                      { label: 'Profile', to: `/author/${user._id}` },
                    ].map(({ label, to }) => (
                      <Link key={to} to={to} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: 'var(--ink-2)' }}
                        onMouseEnter={e => e.target.style.background = 'var(--paper-2)'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}>
                        {label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--paper-3)', margin: '4px 0' }} />
                    <button onClick={handleLogout} style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px',
                      fontSize: '14px', color: 'var(--accent)', background: 'none', border: 'none',
                    }}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}