import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface Props {
  children: JSX.Element
}

export default function PrivateRoute ({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to='/login' replace />

  return children
}
