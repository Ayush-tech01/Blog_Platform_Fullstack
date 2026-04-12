import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'

export default function SavedPosts() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/saved')
      .then(({ data }) => setPosts(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Saved Stories</h1>
      <p style={{ color: 'var(--ink-3)', fontSize: '14px', marginBottom: '2rem' }}>
        {posts.length} {posts.length === 1 ? 'story' : 'stories'} saved
      </p>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ink-4)' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: '8px' }}>Nothing saved yet</div>
          <p style={{ fontSize: '14px', marginBottom: '1.5rem' }}>Tap the ☆ Save button on any story to bookmark it here.</p>
          <Link to="/blog" className="btn btn-primary">Browse Stories</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {posts.map(p => p && <PostCard key={p._id} post={p} />)}
        </div>
      )}
    </div>
  )
}
