import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'

export default function Home() {
  const [featured, setFeatured]   = useState([])
  const [recent, setRecent]       = useState([])
  const [tags, setTags]           = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/posts?featured=true&limit=1'),
      api.get('/posts?limit=6'),
      api.get('/tags'),
    ]).then(([f, r, t]) => {
      setFeatured(f.data.posts)
      setRecent(r.data.posts)
      setTags(t.data.slice(0, 10))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  return (
    <div>
      {/* Hero strip */}
      <div style={{ background: 'var(--ink)', padding: '3.5rem 0 2.5rem', borderBottom: '1px solid #333' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '3rem', color: 'var(--paper)', fontWeight: 400, letterSpacing: '-1px' }}>
              Ideas worth
            </h1>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '3rem', color: 'var(--accent)', fontStyle: 'italic' }}>reading.</span>
          </div>
          <p style={{ color: 'var(--ink-4)', fontSize: '15px', maxWidth: '440px', lineHeight: 1.7 }}>
            A place for curious minds. Stories on technology, culture, design, and everything in between.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {tags.map(t => (
              <Link key={t._id} to={`/blog?tag=${t._id}`}
                style={{ padding: '5px 14px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', color: 'var(--ink-4)', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.color = 'var(--paper)' }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = 'var(--ink-4)' }}>
                {t._id} <span style={{ opacity: 0.5, fontSize: '11px' }}>{t.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>

        {/* Featured post */}
        {featured.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <span style={{ width: '24px', height: '2px', background: 'var(--accent)', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Featured Story</span>
            </div>
            <PostCard post={featured[0]} variant="featured" />
          </section>
        )}

        {/* Recent posts grid */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '24px', height: '2px', background: 'var(--ink-3)', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Latest Stories</span>
            </div>
            <Link to="/blog" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500 }}>View all →</Link>
          </div>

          {recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink-4)' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: '8px' }}>No stories yet</div>
              <p style={{ fontSize: '14px' }}>Be the first to <Link to="/register" style={{ color: 'var(--accent)' }}>publish a story</Link>.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {recent.map(p => <PostCard key={p._id} post={p} />)}
            </div>
          )}
        </section>

        {/* CTA for authors */}
        <div style={{ marginTop: '4rem', background: 'var(--paper-2)', borderRadius: '8px', padding: '3rem', textAlign: 'center', border: '1px solid var(--paper-3)' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>Have a story to tell?</h2>
          <p style={{ color: 'var(--ink-3)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Join Inkwell as an author and share your ideas with a community of readers.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px' }}>Start writing today</Link>
        </div>
      </div>
    </div>
  )
}
