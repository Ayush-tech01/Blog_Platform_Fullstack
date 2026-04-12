import { Link } from 'react-router-dom'

export default function PostCard({ post, variant = 'default' }) {
  const { slug, title, excerpt, coverImage, author, customAuthorName, tags, category, readTime, views, likes, createdAt } = post
  const date = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const displayName = customAuthorName || author?.name
  const initials = displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  if (variant === 'featured') {
    return (
      <Link to={`/blog/${slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--paper-3)',
          background: '#fff', transition: 'box-shadow 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(26,26,24,0.12)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
          <div style={{
            background: coverImage ? `url(${coverImage}) center/cover` : 'linear-gradient(135deg, var(--ink) 0%, var(--ink-2) 100%)',
            minHeight: '320px',
          }} />
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="tag tag-accent" style={{ marginBottom: '1rem', alignSelf: 'flex-start' }}>{category}</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.7rem', marginBottom: '1rem', lineHeight: 1.3, color: 'var(--ink)' }}>
              {title}
            </h2>
            <p style={{ color: 'var(--ink-3)', fontSize: '15px', lineHeight: 1.7, marginBottom: '1.5rem' }}>{excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                {author?.avatar
                  ? <img src={author.avatar} alt={displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : initials}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{displayName}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-4)' }}>{date} · {readTime} min read</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/blog/${slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article style={{
        background: '#fff', borderRadius: '8px', border: '1px solid var(--paper-3)',
        overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,26,24,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = '' }}>

        {coverImage && (
          <div style={{ height: '180px', background: `url(${coverImage}) center/cover`, borderBottom: '1px solid var(--paper-3)' }} />
        )}
        {!coverImage && (
          <div style={{ height: '8px', background: `linear-gradient(90deg, var(--accent), var(--gold))` }} />
        )}

        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span className="tag" style={{ fontSize: '11px', padding: '2px 8px' }}>{category}</span>
            {tags?.slice(0, 2).map(t => (
              <span key={t} className="tag" style={{ fontSize: '11px', padding: '2px 8px' }}>{t}</span>
            ))}
          </div>

          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', marginBottom: '8px', lineHeight: 1.35, color: 'var(--ink)' }}>
            {title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: '1rem',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {excerpt}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--paper-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="avatar-circle" style={{ width: '26px', height: '26px', fontSize: '10px' }}>
                {author?.avatar
                  ? <img src={author.avatar} alt={displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : initials}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{displayName}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-4)', display: 'flex', gap: '10px' }}>
              <span>{readTime} min</span>
              <span>{views} views</span>
              <span>♥ {likes?.length || 0}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}