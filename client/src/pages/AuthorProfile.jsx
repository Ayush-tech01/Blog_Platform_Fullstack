import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'

export default function AuthorProfile() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const displayName = searchParams.get('name')

  const [author, setAuthor] = useState(null)
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/users/${id}`),
      api.get(`/posts?author=${id}`),
    ]).then(([{ data: u }, { data: p }]) => {
      setAuthor(u)
      setPosts(p.posts)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="spinner" />
  if (!author) return <div className="container" style={{ padding: '2rem' }}>Author not found</div>

  const initials = (displayName || author.name)?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--ink)', padding: '3.5rem 0 2.5rem' }}>
        <div className="container" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className="avatar-circle" style={{ width: '80px', height: '80px', fontSize: '26px', flexShrink: 0 }}>
            {author.avatar
              ? <img src={author.avatar} alt={author.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : initials}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--paper)', marginBottom: '6px' }}>
              {displayName || author.name}
            </h1>
            {(displayName !== author.name ? searchParams.get('bio') : author.bio) && (
              <p style={{ color: 'var(--ink-4)', fontSize: '14px', maxWidth: '480px', lineHeight: 1.7 }}>
                {searchParams.get('bio') || author.bio}
              </p>
            )}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '13px', color: 'var(--ink-4)' }}>
              <span>{author.postCount || posts.length} stories</span>
              {(searchParams.get('website') || author.website) && (
                <a href={searchParams.get('website') || author.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                  {(searchParams.get('website') || author.website).replace(/https?:\/\//, '')}
                </a>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--ink-3)' }}>
          Stories by {displayName || author.name}
        </h2>
        {posts.length === 0 ? (
          <p style={{ color: 'var(--ink-4)', fontSize: '14px' }}>No published stories yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {posts.map(p => <PostCard key={p._id} post={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}