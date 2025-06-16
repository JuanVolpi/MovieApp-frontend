import { useEffect, useState } from 'react'
import { getFollowers, getFollowing } from '@/services/communityService'
import { useAuth } from '@/context/AuthContext'
import { getWatchedMovies } from '@/services/historyService'
import MovieGrid from '@/components/grid/MovieGrid'
import ListModal from '@/components/modal/ListModal'
import UserHeader from '@/components/card/UserHeaderCard'
import Navbar from '@/components/navbar'

export default function ProfilePage () {
  const { user } = useAuth()
  const [watched, setWatched] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [loadingFollowing, setLoadingFollowing] = useState(false)

  useEffect(() => {
    if (!user) return
    getWatchedMovies(user.id).then(setWatched)
  }, [user])

  const handleOpenFollowers = async () => {
    if (!user) return
    setLoadingFollowers(true)
    try {
      const data = await getFollowers(user.id)
      console.log('followers API:', data)
      setFollowers(
        data.map((u: any) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          avatar: u.image_url || `https://i.pravatar.cc/150?u=${u.id}`,
          followersCount: u.followers_count,
          followingCount: u.following_count,
          jaSegue: false
        }))
      )
      setShowFollowers(true)
    } catch (err) {
      console.error('Erro ao buscar followers', err)
    } finally {
      setLoadingFollowers(false)
    }
  }

  const handleOpenFollowing = async () => {
    if (!user) return
    setLoadingFollowing(true)
    try {
      const data = await getFollowing(user.id)
      console.log('following API:', data)
      setFollowing(
        data.map((u: any) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          avatar: u.image_url || `https://i.pravatar.cc/150?u=${u.id}`,
          followersCount: u.followers_count,
          followingCount: u.following_count,
          jaSegue: true
        }))
      )
      setShowFollowing(true)
    } catch (err) {
      console.error('Erro ao buscar following', err)
    } finally {
      setLoadingFollowing(false)
    }
  }

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
          onShowFollowers={handleOpenFollowers}
          onShowFollowing={handleOpenFollowing}
        />

        <MovieGrid filmes={watched} onFilmeClick={() => {}} />

        <ListModal
          isOpen={showFollowers}
          onClose={() => setShowFollowers(false)}
          titulo='Seguidores'
          lista={followers}
        />
        <ListModal
          isOpen={showFollowing}
          onClose={() => setShowFollowing(false)}
          titulo='Seguindo'
          lista={following}
        />
      </div>
    </>
  )
}
