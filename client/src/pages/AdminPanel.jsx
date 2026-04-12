import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

export default function AdminPanel() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab]         = useState('overview')
  const [stats, setStats]     = useState(null)
  const [users, setUsers]     = useState([])
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg]         = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [{ data: s }, { data: u }, { data: p }] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/posts?limit=100'),
      ])
      setStats(s)
      setUsers(u)
      setPosts(p.posts)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" permanently? This cannot be undone.`)) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(prev => prev.filter(u => u._id !== id))
      showMsg(`User "${name}" deleted.`)
    } catch (err) {
      showMsg('Failed to delete user.')
    }
  }

  const handleRoleChange = async (id, newRole, name) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: data.role } : u))
      showMsg(`"${name}" role changed to ${newRole}.`)
    } catch (err) {
      showMsg('Failed to update role.')
    }
  }

  const handleDeletePost = async (id, title) => {
    if (!window.confirm(`Delete post "${title}"?`)) return
    try {
      await api.delete(`/posts/${id}`)
      setPosts(prev => prev.filter(p => p._id !== id))
      showMsg(`Post deleted.`)
    } catch (err) {
      showMsg('Failed to delete post.')
    }
  }

  const showMsg = (text) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  const roleColor = (role) => {
    if (role === 'admin')    return { bg: '#fdf0ef', color: '#a93226', border: '#f5c6c2' }
    if (role === 'author')   return { bg: '#edfaf1', color: '#1e6e3e', border: '#b7e4c7' }
    return { bg: 'var(--paper-2)', color: 'var(--ink-3)', border: 'var(--paper-3)' }
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users',    label: `Users (${users.length})` },
    { id: 'posts',    label: `Posts (${posts.length})` },
  ]

  if (loading) return <div className="spinner" />

  return (
    <div style={{ background: 'var(--paper)', minHeight: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div style={{ background: 'var(--ink)', padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--paper)', marginBottom: '4px' }}>
            Admin Panel
          </h1>
          <p style={{ color: 'var(--ink-4)', fontSize: '14px' }}>
            Manage users, posts and monitor platform activity
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>

        {/* Toast message */}
        {msg && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{msg}</div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--paper-3)', marginBottom: '2rem' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none',
                borderBottom: tab === t.id ? '2px solid var(--ink)' : '2px solid transparent',
                cursor: 'pointer', fontSize: '14px', marginBottom: '-1px',
                fontWeight: tab === t.id ? 500 : 400,
                color: tab === t.id ? 'var(--ink)' : 'var(--ink-3)',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && stats && (
          <div>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users',       value: stats.totalUsers,       icon: '👥' },
                { label: 'Total Posts',        value: stats.totalCourses || stats.totalPosts || posts.length, icon: '📝' },
                { label: 'Total Enrollments',  value: stats.totalEnrollments || '-', icon: '📌' },
                { label: 'Recent Signups',     value: stats.recentUsers?.length || 0, icon: '🆕' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: '#fff', border: '1px solid var(--paper-3)', borderRadius: '8px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{icon}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700 }}>{value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Role breakdown */}
            {stats.roleBreakdown && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', marginBottom: '1rem' }}>Users by role</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {stats.roleBreakdown.map(r => {
                    const c = roleColor(r._id)
                    return (
                      <div key={r._id} style={{ padding: '12px 20px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.border}`, textAlign: 'center', minWidth: '100px' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: c.color }}>{r.count}</div>
                        <div style={{ fontSize: '12px', color: c.color, textTransform: 'capitalize', marginTop: '2px' }}>{r._id}s</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Recent signups */}
            {stats.recentUsers?.length > 0 && (
              <div className="card">
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', marginBottom: '1rem' }}>Recent signups</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {stats.recentUsers.map(u => {
                    const c = roleColor(u.role)
                    const initials = u.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    return (
                      <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--paper-2)', borderRadius: '6px' }}>
                        <div className="avatar-circle" style={{ width: '34px', height: '34px', fontSize: '12px', flexShrink: 0 }}>{initials}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: '14px' }}>{u.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-4)' }}>{u.email}</div>
                        </div>
                        <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, background: c.bg, color: c.color, border: `1px solid ${c.border}`, textTransform: 'capitalize' }}>
                          {u.role}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--ink-4)' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div>
            <div style={{ marginBottom: '1rem', fontSize: '14px', color: 'var(--ink-3)' }}>
              {users.length} total users — click role badge to change role
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--paper-3)', borderRadius: '8px', overflow: 'hidden' }}>
              {users.map((u, i) => {
                const c = roleColor(u.role)
                const initials = u.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                const isCurrentUser = u._id === user._id
                return (
                  <div key={u._id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                    borderBottom: i < users.length - 1 ? '1px solid var(--paper-2)' : 'none',
                    background: isCurrentUser ? 'var(--paper-2)' : '#fff',
                  }}>
                    <div className="avatar-circle" style={{ width: '36px', height: '36px', fontSize: '13px', flexShrink: 0 }}>{initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '14px' }}>
                        {u.name} {isCurrentUser && <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>(you)</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-4)' }}>{u.email}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-4)' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    {/* Role change dropdown */}
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u._id, e.target.value, u.name)}
                      disabled={isCurrentUser}
                      style={{
                        padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                        cursor: isCurrentUser ? 'not-allowed' : 'pointer',
                        width: 'auto', opacity: isCurrentUser ? 0.6 : 1,
                      }}>
                      <option value="reader">reader</option>
                      <option value="author">author</option>
                      <option value="admin">admin</option>
                    </select>

                    {/* Delete button */}
                    {!isCurrentUser && (
                      <button onClick={() => handleDeleteUser(u._id, u.name)}
                        style={{ background: '#fdf0ef', color: 'var(--accent)', border: '1px solid #f5c6c2', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' }}>
                        Delete
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* POSTS TAB */}
        {tab === 'posts' && (
          <div>
            <div style={{ marginBottom: '1rem', fontSize: '14px', color: 'var(--ink-3)' }}>
              {posts.length} published posts
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--paper-3)', borderRadius: '8px', overflow: 'hidden' }}>
              {posts.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-4)' }}>No posts yet.</div>
              ) : posts.map((p, i) => (
                <div key={p._id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                  borderBottom: i < posts.length - 1 ? '1px solid var(--paper-2)' : 'none',
                }}>
                  {p.coverImage && (
                    <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: `url(${p.coverImage}) center/cover`, flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '2px', display: 'flex', gap: '10px' }}>
                      <span>by {p.customAuthorName || p.author?.name}</span>
                      <span>{p.views} views</span>
                      <span>♥ {p.likes?.length || 0}</span>
                      <span>{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, background: 'var(--paper-2)', color: 'var(--ink-3)', border: '1px solid var(--paper-3)', whiteSpace: 'nowrap' }}>
                    {p.category}
                  </span>
                  <Link to={`/blog/${p.slug}`} className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }}>
                    View
                  </Link>
                  <button onClick={() => handleDeletePost(p._id, p.title)}
                    style={{ background: '#fdf0ef', color: 'var(--accent)', border: '1px solid #f5c6c2', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}