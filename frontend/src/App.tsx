import { Route, Routes, Navigate } from 'react-router-dom'
import MainPage from './pages/Filmes/MainPage'
import CommunityPage from './pages/community/CommunityPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import PublicProfilePage from './pages/profile/PublicProfilePage'
import MyListPage from './pages/Filmes/MyListPage'
import PrivateRoute from './route_protection/PrivateRoute'
import PublicOnlyRoute from './route_protection/PublicOnlyRoute'

function App () {
  return (
    <Routes>
      <Route
        path='/login'
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path='/register'
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path='/'
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/filmes'
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/community'
        element={
          <PrivateRoute>
            <CommunityPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/mylist'
        element={
          <PrivateRoute>
            <MyListPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/perfil/:id'
        element={
          <PrivateRoute>
            <PublicProfilePage />
          </PrivateRoute>
        }
      />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

export default App
