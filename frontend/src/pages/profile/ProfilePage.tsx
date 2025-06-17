// ProfilePage.tsx

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getWatchedMovies } from '@/services/historyService'
import MovieGrid from '@/components/grid/MovieGrid'
import UserHeader from '@/components/card/UserHeaderCard'
import Navbar from '@/components/navbar'
// Importe os componentes de modal autónomos
import FollowersModal from '@/components/modal/FollowersModal'
import FollowingModal from '@/components/modal/FollowingModal' // (lembre-se de o atualizar também)

export default function ProfilePage () {
  const { user } = useAuth()
  const [watched, setWatched] = useState([])

  // O estado é apenas para controlar a visibilidade. Mais nada.
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

  useEffect(() => {
    if (!user) return
    getWatchedMovies(user.id).then(setWatched)
  }, [user])

  if (!user) return null

  return (
    <>
      <Navbar />
      <div className='max-w-5xl mx-auto p-4 space-y-8'>
        <UserHeader
          avatar={user.avatar}
          username={user.username}
          email={user.email}
          followersCount={user.followers_count || 0}
          followingCount={user.following_count || 0}
          // Os cliques apenas mudam o estado de visibilidade
          onShowFollowers={() => setShowFollowers(true)}
          onShowFollowing={() => setShowFollowing(true)}
        />

        <MovieGrid filmes={watched} onFilmeClick={() => {}} />

        {/* Renderize os modais. Eles sabem o que fazer. */}
        <FollowersModal
          isOpen={showFollowers}
          onClose={() => setShowFollowers(false)}
          userId={user.id}
        />

        {/* Aplique a mesma lógica do FollowersModal ao FollowingModal */}
        <FollowingModal
          isOpen={showFollowing}
          onClose={() => setShowFollowing(false)}
          userId={user.id}
        />
      </div>
    </>
  )
}
