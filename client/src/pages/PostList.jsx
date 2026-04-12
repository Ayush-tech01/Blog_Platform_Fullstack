import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'

const CATEGORIES = ['All', 'Technology', 'Design', 'Culture', 'Science', 'Business', 'Travel', 'Health', 'General']

export default function PostList() {
  const [posts, setPosts]           = useState([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(1)
  const [search, setSearch]         = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory]     = useState('All')
  const [tags, setTags]             = useState([])
  const [activeTag, setActiveTag]   = useState('')
  const [searchParams]              = useSearchParams()

  useEffect(() => {
    const tagFromUrl = searchParams.get('tag')
    if (tagFromUrl) setActiveTag(tagFromUrl)
    api.get('/tags').then(r => setTags(r.data.slice(0, 12))).catch(() => {})
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [page, category, search, activeTag])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 9 })
      if (category !== 'All') params.set('category', category)
      if (search) params.set('search', search)
      if (activeTag) params.set('tag', activeTag)
      const { data } = await api.get(`/posts?${params}`)
      setPosts(data.posts)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const totalPages = Math.ceil(total / 9)

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>All Stories</h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '14px' }}>{total} {total === 1 ? 'story' : 'stories'} published</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', maxWidth: '480px' }}>
        <input placeholder="Search stories..." value={searchInput}
          onChange={e => setSearchInput(e.target.value)} />
        <button className="btn btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }}>Search</button>
        {search && (
          <button type="button" className="btn btn-ghost" onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}>
            Clear
          </button>
        )}
      </form>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {CATEGORIES.map(cat => (
          <button key={cat}
            onClick={() => { setCategory(cat); setPage(1) }}
            className={`tag ${category === cat ? 'active' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Tag pills */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {activeTag && (
            <button className="tag tag-accent" onClick={() => { setActiveTag(''); setPage(1) }}>
              #{activeTag} ×
            </button>
          )}
          {tags.filter(t => t._id !== activeTag).map(t => (
            <button key={t._id}
              onClick={() => { setActiveTag(t._id); setPage(1) }}
              style={{ padding: '2px 10px', borderRadius: '99px', fontSize: '12px', border: '1px solid var(--paper-3)', background: 'var(--paper-2)', color: 'var(--ink-3)', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--ink-3)'; e.target.style.color = 'var(--ink)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--paper-3)'; e.target.style.color = 'var(--ink-3)' }}>
              #{t._id}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="spinner" />
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ink-4)' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: '8px' }}>No stories found</div>
          <p style={{ fontSize: '14px' }}>Try a different search or category.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {posts.map(p => <PostCard key={p._id} post={p} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '3rem', alignItems: 'center' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn btn-ghost btn-sm" style={{ opacity: page === 1 ? 0.4 : 1 }}>
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '6px', border: '1px solid',
                    borderColor: page === p ? 'var(--ink)' : 'var(--paper-3)',
                    background: page === p ? 'var(--ink)' : '#fff',
                    color: page === p ? 'var(--paper)' : 'var(--ink-2)',
                    cursor: 'pointer', fontWeight: page === p ? 500 : 400, fontSize: '14px',
                  }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="btn btn-ghost btn-sm" style={{ opacity: page === totalPages ? 0.4 : 1 }}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
