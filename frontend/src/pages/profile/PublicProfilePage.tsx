import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  getUserById,
  getFollowers,
  getFollowing
} from '@/services/communityService'
import { getWatchedMovies } from '@/services/historyService'
import MovieGrid from '@/components/grid/MovieGrid'
import { Filme, User } from '@/types'
import ListModal from '@/components/modal/ListModal'
import UserHeader from '@/components/card/UserHeaderCard'
import Navbar from '@/components/navbar'

export default function PerfilPublico () {
  const { id } = useParams<{ id: string }>()
  const [userData, setUserData] = useState<User | null>(null)
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [showModal, setShowModal] = useState<'followers' | 'following' | null>(
    null
  )

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const uid = Number(id)
      const [user, movies, seg, seguidos] = await Promise.all([
        getUserById(uid),
        getWatchedMovies(uid),
        getFollowers(uid),
        getFollowing(uid)
      ])
      setUserData(user)
      setFilmes(movies)
      setFollowers(seg)
      setFollowing(seguidos)
    })()
  }, [id])

  if (!userData)
    return <p className='text-center mt-10'>Carregando perfil...</p>

  return (
    <>
      <Navbar />
      <div className='p-6 max-w-6xl mx-auto flex flex-col items-center'>
        <UserHeader
          avatar={userData.avatar}
          username={userData.username}
          email={userData.email}
          followersCount={followers.length}
          followingCount={following.length}
          onShowFollowers={() => setShowModal('followers')}
          onShowFollowing={() => setShowModal('following')}
        />

        <h2 className='text-2xl font-semibold mb-4'>Últimos assistidos</h2>
        <MovieGrid
          filmes={filmes}
          onFilmeClick={(filme: Filme) => {
            console.log('Filme clicado:', filme)
            // futuro: abrir modal de detalhes
          }}
        />

        <ListModal
          title={showModal === 'followers' ? 'Seguidores' : 'Seguindo'}
          isOpen={!!showModal}
          onClose={() => setShowModal(null)}
          users={showModal === 'followers' ? followers : following}
        />
      </div>
    </>
  )
}
