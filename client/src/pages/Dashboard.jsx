import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Dashboard() {
  const { user, updateUser } = useAuthStore()
  const [myPosts, setMyPosts]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState('posts')
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '', website: user?.website || '' })
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState('')

  useEffect(() => {
    if (user?.role === 'author' || user?.role === 'admin') {
      api.get('/posts/author/my')
        .then(({ data }) => setMyPosts(data))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/auth/profile', profileForm)
      updateUser(data)
      setSaveMsg('Profile updated!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return
    try {
      await api.delete(`/posts/${id}`)
      setMyPosts(prev => prev.filter(p => p._id !== id))
    } catch {}
  }

  const published = myPosts.filter(p => p.status === 'published')
  const drafts    = myPosts.filter(p => p.status === 'draft')
  const totalViews = myPosts.reduce((s, p) => s + (p.views || 0), 0)
  const totalLikes = myPosts.reduce((s, p) => s + (p.likes?.length || 0), 0)

  const tabs = ['posts', 'profile']
  if (user?.role === 'reader') tabs.splice(0, 1)

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '14px' }}>Welcome back, {user?.name}</p>
      </div>

      {/* Stats — author/admin only */}
      {(user?.role === 'author' || user?.role === 'admin') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Posts', value: myPosts.length, icon: '📝' },
            { label: 'Published',   value: published.length, icon: '✅' },
            { label: 'Total Views', value: totalViews, icon: '👁️' },
            { label: 'Total Likes', value: totalLikes, icon: '♥' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid var(--paper-3)', borderRadius: '8px', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{icon}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--paper-3)', marginBottom: '2rem' }}>
        {(user?.role === 'author' || user?.role === 'admin') && (
          <button onClick={() => setTab('posts')}
            style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === 'posts' ? '2px solid var(--ink)' : '2px solid transparent', cursor: 'pointer', fontSize: '14px', fontWeight: tab === 'posts' ? 500 : 400, color: tab === 'posts' ? 'var(--ink)' : 'var(--ink-3)', marginBottom: '-1px' }}>
            My Stories
          </button>
        )}
        <button onClick={() => setTab('profile')}
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === 'profile' ? '2px solid var(--ink)' : '2px solid transparent', cursor: 'pointer', fontSize: '14px', fontWeight: tab === 'profile' ? 500 : 400, color: tab === 'profile' ? 'var(--ink)' : 'var(--ink-3)', marginBottom: '-1px' }}>
          Profile
        </button>
      </div>

      {/* Posts tab */}
      {tab === 'posts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--ink-3)' }}>
              <span>{published.length} published</span>
              <span>·</span>
              <span>{drafts.length} drafts</span>
            </div>
            <Link to="/write" className="btn btn-accent btn-sm">+ New Story</Link>
          </div>

          {loading ? <div className="spinner" />
          : myPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink-4)' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '8px' }}>No stories yet</div>
              <Link to="/write" className="btn btn-primary" style={{ marginTop: '8px' }}>Write your first story</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid var(--paper-3)', borderRadius: '8px', overflow: 'hidden' }}>
              {myPosts.map((post, i) => (
                <div key={post._id} style={{ background: '#fff', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: i < myPosts.length - 1 ? '1px solid var(--paper-2)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '15px', marginBottom: '3px' }}>{post.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-4)', display: 'flex', gap: '10px' }}>
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>{post.views} views</span>
                      <span>♥ {post.likes?.length || 0}</span>
                      <span>{post.readTime} min</span>
                    </div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, background: post.status === 'published' ? '#edfaf1' : 'var(--paper-2)', color: post.status === 'published' ? '#1e6e3e' : 'var(--ink-3)', border: '1px solid', borderColor: post.status === 'published' ? '#b7e4c7' : 'var(--paper-3)' }}>
                    {post.status}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link to={`/blog/${post.slug}`} className="btn btn-ghost btn-sm">View</Link>
                    <Link to={`/edit/${post._id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button onClick={() => handleDelete(post._id)} className="btn btn-sm"
                      style={{ background: '#fdf0ef', color: 'var(--accent)', border: '1px solid #f5c6c2' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile tab */}
      {tab === 'profile' && (
        <div style={{ maxWidth: '540px' }}>
          {saveMsg && <div className="alert alert-success">{saveMsg}</div>}
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Display name</label>
              <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea rows={3} value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Tell readers about yourself..." style={{ resize: 'vertical' }} maxLength={300} />
              <div style={{ fontSize: '12px', color: 'var(--ink-4)', textAlign: 'right', marginTop: '4px' }}>{profileForm.bio.length}/300</div>
            </div>
            <div className="form-group">
              <label>Avatar URL</label>
              <input value={profileForm.avatar} onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input value={profileForm.website} onChange={e => setProfileForm({ ...profileForm, website: e.target.value })} placeholder="https://yoursite.com" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving} style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
