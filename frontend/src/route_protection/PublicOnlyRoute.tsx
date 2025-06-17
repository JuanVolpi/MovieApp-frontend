import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface Props {
  children: JSX.Element
}

export default function PublicOnlyRoute ({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to='/' replace />

  return children
}
