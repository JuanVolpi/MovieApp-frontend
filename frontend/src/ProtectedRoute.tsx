import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

interface ProtectedRouteProps {
  children: JSX.Element
}

export default function ProtectedRoute ({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) return null // ou spinner, ou tela de carregamento

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return children
}
