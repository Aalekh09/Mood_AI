import { Routes, Route, Link, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChatPage from './pages/ChatPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="p-4 border-b bg-white flex gap-4">
        <Link to="/chat" className="font-semibold">Mood AI</Link>
        <span className="ml-auto" />
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <main className="p-4 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>
    </div>
  )
}

