import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--paper-3)', padding: '3rem 0', marginTop: '4rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--paper)', marginBottom: '4px' }}>
            Inkwell
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink-4)' }}>Stories worth reading.</div>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '14px' }}>
          <Link to="/blog" style={{ color: 'var(--ink-4)' }}>Stories</Link>
          <Link to="/register" style={{ color: 'var(--ink-4)' }}>Write</Link>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ink-4)' }}>
          © {new Date().getFullYear()} Inkwell
        </div>
      </div>
    </footer>
  )
}
