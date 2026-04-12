import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
import PostCard from '../components/PostCard'

function CommentItem({ comment, onDelete, onLike, user, postId, onReply }) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const date = new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const initials = comment.author?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    await onReply(replyText, comment._id)
    setReplyText('')
    setShowReply(false)
  }

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
      <div className="avatar-circle" style={{ width: '34px', height: '34px', fontSize: '12px', flexShrink: 0 }}>
        {comment.author?.avatar
          ? <img src={comment.author.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          : initials}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>{comment.author?.name}</span>
          <span style={{ fontSize: '12px', color: 'var(--ink-4)' }}>{date}</span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: '8px' }}>{comment.content}</p>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--ink-4)' }}>
          <button onClick={() => onLike(comment._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ♥ {comment.likes?.length || 0}
          </button>
          {user && (
            <button onClick={() => setShowReply(!showReply)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', fontSize: '12px' }}>
              Reply
            </button>
          )}
          {user && (user._id === comment.author?._id || user.role === 'admin') && (
            <button onClick={() => onDelete(comment._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '12px' }}>
              Delete
            </button>
          )}
        </div>

        {showReply && (
          <form onSubmit={handleReply} style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <input value={replyText} onChange={e => setReplyText(e.target.value)}
              placeholder="Write a reply..." style={{ fontSize: '13px' }} />
            <button className="btn btn-primary btn-sm" type="submit">Reply</button>
          </form>
        )}

        {comment.replies?.map(reply => (
          <div key={reply._id} style={{ display: 'flex', gap: '10px', marginTop: '12px', paddingLeft: '8px', borderLeft: '2px solid var(--paper-3)' }}>
            <div className="avatar-circle" style={{ width: '26px', height: '26px', fontSize: '10px', flexShrink: 0 }}>
              {reply.author?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '3px' }}>
                <span style={{ fontWeight: 500, fontSize: '13px' }}>{reply.author?.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{new Date(reply.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.6 }}>{reply.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PostDetail() {
  const { slug } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [post, setPost]             = useState(null)
  const [comments, setComments]     = useState([])
  const [related, setRelated]       = useState([])
  const [newComment, setNewComment] = useState('')
  const [liked, setLiked]           = useState(false)
  const [likeCount, setLikeCount]   = useState(0)
  const [saved, setSaved]           = useState(false)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchAll = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/posts/${slug}`)
        setPost(data)
        setLikeCount(data.likes?.length || 0)
        setLiked(user ? data.likes?.includes(user._id) : false)
        const [{ data: c }, { data: r }] = await Promise.all([
          api.get(`/comments/${data._id}`),
          api.get(`/posts/related/${slug}`),
        ])
        setComments(c)
        setRelated(r)
      } catch {
        navigate('/blog')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [slug])

  const handleLike = async () => {
    if (!user) return navigate('/login')
    try {
      const { data } = await api.post(`/posts/${post._id}/like`)
      setLikeCount(data.likes)
      setLiked(data.liked)
    } catch {}
  }

  const handleSave = async () => {
    if (!user) return navigate('/login')
    try {
      const { data } = await api.post(`/users/save/${post._id}`)
      setSaved(data.saved)
    } catch {}
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const { data } = await api.post(`/comments/${post._id}`, { content: newComment })
      setComments(prev => [{ ...data, replies: [] }, ...prev])
      setNewComment('')
    } catch {}
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`)
      setComments(prev => prev.filter(c => c._id !== commentId))
    } catch {}
  }

  const handleLikeComment = async (commentId) => {
    if (!user) return navigate('/login')
    try {
      await api.post(`/comments/${commentId}/like`)
      setComments(prev => prev.map(c => {
        if (c._id !== commentId) return c
        const liked = c.likes?.includes(user._id)
        return { ...c, likes: liked ? c.likes.filter(id => id !== user._id) : [...(c.likes || []), user._id] }
      }))
    } catch {}
  }

  const handleReply = async (content, parentId) => {
    try {
      const { data } = await api.post(`/comments/${post._id}`, { content, parent: parentId })
      setComments(prev => prev.map(c => c._id === parentId ? { ...c, replies: [...(c.replies || []), data] } : c))
    } catch {}
  }

  if (loading) return <div className="spinner" />
  if (!post) return null

  const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const initials = (post.customAuthorName || post.author?.name)?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const isOwner = user && (user._id === post.author?._id || user.role === 'admin')

  // Single source of truth for author link — used in both hero and author card
  const authorLink = `/author/${post.author?._id}?name=${encodeURIComponent(post.customAuthorName || post.author?.name || '')}&bio=${encodeURIComponent(post.customAuthorBio || post.author?.bio || '')}&website=${encodeURIComponent(post.customAuthorWebsite || post.author?.website || '')}`
  const authorDisplayName = post.customAuthorName || post.author?.name

  return (
    <article>
      {/* Hero */}
      <div style={{ background: post.coverImage ? `url(${post.coverImage}) center/cover` : 'var(--ink)', minHeight: '380px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
        {!post.coverImage && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--ink) 0%, #2c2c28 100%)' }} />
        )}
        {post.coverImage && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        )}
        <div className="container-sm" style={{ position: 'relative', padding: '3rem 1.5rem' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="tag tag-accent">{post.category}</span>
            {post.tags?.map(t => (
              <span key={t} style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '12px', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}>
                #{t}
              </span>
            ))}
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar — links to author profile with custom name */}
            <Link to={authorLink}>
              <div className="avatar-circle" style={{ width: '42px', height: '42px', fontSize: '14px' }}>
                {post.author?.avatar
                  ? <img src={post.author.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : initials}
              </div>
            </Link>
            <div>
              {/* Name text — same link as avatar */}
              <Link to={authorLink} style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500, fontSize: '14px' }}>
                {authorDisplayName}
              </Link>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{date} · {post.readTime} min read · {post.views} views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--paper-3)', padding: '12px 0', position: 'sticky', top: '64px', zIndex: 100 }}>
        <div className="container-sm" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleLike}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: liked ? '#fdf0ef' : 'var(--paper-2)', border: '1px solid', borderColor: liked ? '#f5c6c2' : 'var(--paper-3)', borderRadius: '99px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', color: liked ? 'var(--accent)' : 'var(--ink-3)', transition: 'all 0.15s' }}>
            {liked ? '♥' : '♡'} {likeCount}
          </button>
          <button onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: saved ? 'var(--ink)' : 'var(--paper-2)', border: '1px solid', borderColor: saved ? 'var(--ink)' : 'var(--paper-3)', borderRadius: '99px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', color: saved ? 'var(--paper)' : 'var(--ink-3)', transition: 'all 0.15s' }}>
            {saved ? '★ Saved' : '☆ Save'}
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--ink-4)' }}>
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
          {isOwner && (
            <>
              <Link to={`/edit/${post._id}`} className="btn btn-ghost btn-sm">Edit</Link>
              <button className="btn btn-sm" onClick={async () => {
                if (!window.confirm('Delete this post?')) return
                await api.delete(`/posts/${post._id}`)
                navigate('/blog')
              }} style={{ background: '#fdf0ef', color: 'var(--accent)', border: '1px solid #f5c6c2' }}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="container-sm" style={{ padding: '3rem 1.5rem' }}>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <hr className="divider" style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem' }} />

      {/* Author card */}
      <div className="container-sm" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ background: 'var(--paper-2)', borderRadius: '8px', padding: '1.5rem', display: 'flex', gap: '1rem', border: '1px solid var(--paper-3)' }}>
          {/* Avatar — same authorLink */}
          <Link to={authorLink}>
            <div className="avatar-circle" style={{ width: '56px', height: '56px', fontSize: '18px', flexShrink: 0 }}>
              {post.author?.avatar
                ? <img src={post.author.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : initials}
            </div>
          </Link>
          <div>
            {/* Name — same authorLink */}
            <Link to={authorLink} style={{ fontWeight: 600, fontSize: '15px', fontFamily: 'var(--serif)' }}>
              {authorDisplayName}
            </Link>
            <p style={{ color: 'var(--ink-3)', fontSize: '13px', marginTop: '4px', lineHeight: 1.6 }}>{post.customAuthorBio || post.author?.bio || 'Writer at Inkwell.'}</p>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="container-sm" style={{ padding: '0 1.5rem 3rem' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
          Comments ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleComment} style={{ marginBottom: '2rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div className="avatar-circle" style={{ width: '34px', height: '34px', fontSize: '12px', marginTop: '2px' }}>
              {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
              <input value={newComment} onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..." style={{ flex: 1 }} />
              <button className="btn btn-primary btn-sm" type="submit">Post</button>
            </div>
          </form>
        ) : (
          <div className="alert alert-info" style={{ background: 'var(--paper-2)', border: '1px solid var(--paper-3)', color: 'var(--ink-3)', marginBottom: '2rem' }}>
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link> to join the conversation.
          </div>
        )}

        {comments.length === 0 ? (
          <p style={{ color: 'var(--ink-4)', fontSize: '14px' }}>No comments yet. Be the first!</p>
        ) : (
          comments.map(c => (
            <CommentItem key={c._id} comment={c} user={user} postId={post._id}
              onDelete={handleDeleteComment} onLike={handleLikeComment} onReply={handleReply} />
          ))
        )}
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div style={{ background: 'var(--paper-2)', padding: '3rem 0', borderTop: '1px solid var(--paper-3)' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>More stories</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {related.map(p => <PostCard key={p._id} post={p} />)}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}