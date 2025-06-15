import { Route, Routes, Navigate } from 'react-router-dom'
import MainPage from './pages/Filmes/MainPage'
import CommunityPage from './pages/community/CommunityPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/profile/PublicProfilePage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ProtectedRoute from './ProtectedRoute'
import PublicProfilePage from './pages/profile/PublicProfilePage'

function App () {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      {/* <Route path="/profile" element={<ProfilePage />} /> */}
      {/* <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} /> */}
      <Route
        path='/community'
        element={
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        }
      />
      <Route path='/filmes' element={<MainPage />} />
      <Route path='/' element={<MainPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='*' element={<Navigate to='/' />} />
      <Route
        path='/perfil/:id'
        element={
          <ProtectedRoute>
            <PublicProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
