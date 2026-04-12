import AdminPanel from './pages/AdminPanel'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import WritePost from './pages/WritePost'
import EditPost from './pages/EditPost'
import Dashboard from './pages/Dashboard'
import AuthorProfile from './pages/AuthorProfile'
import SavedPosts from './pages/SavedPosts'

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/blog"       element={<PostList />} />
          <Route path="/blog/:slug" element={<PostDetail />} />
          <Route path="/author/:id" element={<AuthorProfile />} />
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminPanel /></PrivateRoute>} />
          <Route path="/write"      element={<PrivateRoute roles={['author','admin']}><WritePost /></PrivateRoute>} />
          <Route path="/edit/:id"   element={<PrivateRoute roles={['author','admin']}><EditPost /></PrivateRoute>} />
          <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/saved"      element={<PrivateRoute><SavedPosts /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
