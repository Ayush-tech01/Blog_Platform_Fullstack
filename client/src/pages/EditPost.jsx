import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const CATEGORIES = ['Technology', 'Design', 'Culture', 'Science', 'Business', 'Travel', 'Health', 'General']

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/posts/author/my`).then(({ data }) => {
      const post = data.find(p => p._id === id)
      if (!post) return navigate('/dashboard')
      setForm({ ...post, tags: post.tags?.join(', ') || '' })
    })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.put(`/posts/${id}`, {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      })
      navigate(`/blog/${data.slug}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!form) return <div className="spinner" />

  return (
    <div style={{ background: 'var(--paper)', minHeight: 'calc(100vh - 64px)', padding: '2.5rem 0' }}>
      <div className="container-sm">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem' }}>Edit Story</h1>
          <button form="edit-form" type="submit" className="btn btn-accent" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form id="edit-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700 }} required />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea rows={16} value={form.content.replace(/<[^>]*>/g, '')}
              onChange={e => setForm({ ...form, content: e.target.value })}
              style={{ resize: 'vertical', fontFamily: 'var(--serif)', fontSize: '16px', lineHeight: 1.8 }} />
          </div>

          <div className="card">
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--ink-3)' }}>Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tags</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="react, javascript" />
              </div>
            </div>
            <div className="form-group">
              <label>Cover image URL</label>
              <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label>Custom author name (optional)</label>
              <input
                value={form.customAuthorName || ''}
                onChange={e => setForm({ ...form, customAuthorName: e.target.value })}
                placeholder="Leave blank to use your account name"
              />
            </div>
            <div className="form-group">
              <label>Custom author bio (optional)</label>
              <textarea
                rows={2}
                value={form.customAuthorBio || ''}
                onChange={e => setForm({ ...form, customAuthorBio: e.target.value })}
                placeholder="Leave blank to use account bio"
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="form-group">
              <label>Custom author website (optional)</label>
              <input
                value={form.customAuthorWebsite || ''}
                onChange={e => setForm({ ...form, customAuthorWebsite: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: 0, fontSize: '13px' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ width: 'auto' }} />
                Featured
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: 0, fontSize: '13px' }}>
                <input type="checkbox" checked={form.status === 'published'} onChange={e => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })} style={{ width: 'auto' }} />
                Published
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
