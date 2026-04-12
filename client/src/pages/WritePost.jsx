import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const CATEGORIES = ['Technology', 'Design', 'Culture', 'Science', 'Business', 'Travel', 'Health', 'General']

// Simple rich text toolbar
function RichEditor({ value, onChange }) {
  const editorRef = useRef(null)

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
    onChange(editorRef.current?.innerHTML || '')
  }

  const toolbarBtns = [
    { label: 'B', cmd: 'bold', style: { fontWeight: 700 } },
    { label: 'I', cmd: 'italic', style: { fontStyle: 'italic' } },
    { label: 'H2', cmd: 'formatBlock', val: 'h2', style: {} },
    { label: 'H3', cmd: 'formatBlock', val: 'h3', style: {} },
    { label: '❝', cmd: 'formatBlock', val: 'blockquote', style: {} },
    { label: 'UL', cmd: 'insertUnorderedList', style: {} },
    { label: 'OL', cmd: 'insertOrderedList', style: {} },
    { label: '—', cmd: 'insertHorizontalRule', style: {} },
    { label: 'Link', cmd: 'createLink', val: prompt, style: { fontSize: '11px' } },
  ]

  return (
    <div style={{ border: '1.5px solid var(--paper-3)', borderRadius: 'var(--radius)', overflow: 'hidden', background: '#fff' }}>
      <div style={{ display: 'flex', gap: '2px', padding: '8px', background: 'var(--paper-2)', borderBottom: '1px solid var(--paper-3)', flexWrap: 'wrap' }}>
        {toolbarBtns.map(({ label, cmd, val, style }) => (
          <button key={label} type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              const v = typeof val === 'function' ? val('Enter URL:') : val
              if (v !== null || !val) exec(cmd, v)
            }}
            style={{ padding: '4px 10px', background: 'none', border: '1px solid transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', color: 'var(--ink-2)', ...style }}
            onMouseEnter={e => e.target.style.background = 'var(--paper-3)'}
            onMouseLeave={e => e.target.style.background = 'none'}>
            {label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        style={{
          minHeight: '400px', padding: '1.5rem', outline: 'none',
          fontFamily: 'var(--serif)', fontSize: '18px', lineHeight: 1.8, color: 'var(--ink-2)',
        }}
        data-placeholder="Tell your story..."
      />
    </div>
  )
}

export default function WritePost() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', coverImage: '',
    category: 'General', tags: '', status: 'published', featured: false, customAuthorName: '', customAuthorBio: '',
    customAuthorWebsite: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Title is required')
    if (!form.content.trim() || form.content === '<br>') return setError('Content is required')
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/posts', {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      })
      navigate(`/blog/${data.slug}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--paper)', minHeight: 'calc(100vh - 64px)', padding: '2.5rem 0' }}>
      <div className="container-sm">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem' }}>New Story</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(f => ({ ...f, status: 'draft' }))}>
              Save Draft
            </button>
            <button form="post-form" type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form id="post-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Title */}
          <input
            placeholder="Story title..."
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', border: 'none', borderBottom: '2px solid var(--paper-3)', borderRadius: 0, padding: '0.5rem 0', background: 'transparent', fontWeight: 700, color: 'var(--ink)' }}
            required
          />

          {/* Editor */}
          <RichEditor value={form.content} onChange={v => setForm({ ...form, content: v })} />

          {/* Meta section */}
          <div className="card" style={{ marginTop: '0.5rem' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--ink-3)' }}>Story settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input placeholder="react, javascript, web" value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Cover image URL</label>
              <input placeholder="https://images.unsplash.com/..." value={form.coverImage}
                onChange={e => setForm({ ...form, coverImage: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Excerpt (optional — auto-generated if left blank)</label>
              <textarea rows={2} value={form.excerpt}
                onChange={e => setForm({ ...form, excerpt: e.target.value })}
                placeholder="A short summary of your story..." style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label>Custom author name (optional)</label>
              <input
                placeholder="Leave blank to use your account name"
                value={form.customAuthorName || ''}
                onChange={e => setForm({ ...form, customAuthorName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Custom author bio (optional)</label>
              <textarea
                rows={2}
                placeholder="Leave blank to use account bio"
                value={form.customAuthorBio || ''}
                onChange={e => setForm({ ...form, customAuthorBio: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="form-group">
              <label>Custom author website (optional)</label>
              <input
                placeholder="https://yourwebsite.com"
                value={form.customAuthorWebsite || ''}
                onChange={e => setForm({ ...form, customAuthorWebsite: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: 0 }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
                  style={{ width: 'auto' }} />
                <span style={{ fontSize: '13px' }}>Mark as featured</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: 0 }}>
                <input type="checkbox" checked={form.status === 'draft'} onChange={e => setForm({ ...form, status: e.target.checked ? 'draft' : 'published' })}
                  style={{ width: 'auto' }} />
                <span style={{ fontSize: '13px' }}>Save as draft</span>
              </label>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
