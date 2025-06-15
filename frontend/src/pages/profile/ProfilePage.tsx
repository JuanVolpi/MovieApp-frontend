import { User } from '@/types'
import { useEffect, useState } from 'react'
import { getFollowers, getFollowing } from '@/services/communityService'
import { Avatar, User as HeroUser, Button } from '@heroui/react'
import { useAuth } from '@/context/AuthContext'
import { getWatchedMovies } from '@/services/historyService'
import MovieGrid from '@/components/grid/MovieGrid'
import ListModal from '@/components/modal/ListModal'
import UserHeader from '@/components/card/UserHeaderCard'
import Navbar from '@/components/navbar'

export default function ProfilePage () {
  const { user } = useAuth()
  const [watched, setWatched] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const [watchedMovies, followersList, followingList] = await Promise.all([
        getWatchedMovies(user.id),
        getFollowers(user.id),
        getFollowing(user.id)
      ])
      setWatched(watchedMovies)
      setFollowers(followersList)
      setFollowing(followingList)
    })()
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
          followersCount={followers.length}
          followingCount={following.length}
          onShowFollowers={() => setShowFollowers(true)}
          onShowFollowing={() => setShowFollowing(true)}
        />

        <div className='flex items-center gap-4'>
          <HeroUser
            avatarProps={{ src: user.avatar || undefined }}
            name={user.username}
            description={user.email || 'Utilizador'}
          />
          <div className='flex gap-4'>
            <Button onPress={() => setShowFollowers(true)} variant='ghost'>
              Seguidores: {followers.length}
            </Button>
            <Button onPress={() => setShowFollowing(true)} variant='ghost'>
              Seguindo: {following.length}
            </Button>
          </div>
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-2'>Últimos assistidos</h2>
          <MovieGrid filmes={watched} onFilmeClick={() => {}} />
        </div>

        <ListModal
          isOpen={showFollowers}
          onClose={() => setShowFollowers(false)}
          title='Seguidores'
          users={followers}
        />
        <ListModal
          isOpen={showFollowing}
          onClose={() => setShowFollowing(false)}
          title='Seguindo'
          users={following}
        />
      </div>
    </>
  )
}
