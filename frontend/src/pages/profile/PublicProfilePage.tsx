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
import MovieModal from '@/components/modal/MovieModal'

export default function PerfilPublico () {
  const { id } = useParams<{ id: string }>()
  const [userData, setUserData] = useState<User | null>(null)
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [showModal, setShowModal] = useState<'followers' | 'following' | null>(
    null
  )
  const [modalFilme, setModalFilme] = useState<Filme | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const uid = Number(id)
      const [user, entries, seg, seguidos] = await Promise.all([
        getUserById(uid),
        getWatchedMovies(uid),
        getFollowers(uid),
        getFollowing(uid)
      ])
      setUserData({
        ...user,
        avatar: user.image_url || `https://i.pravatar.cc/150?u=${user.id}`
      })

      // Normalização dos dados como em MyListPage
      const filmesNormalizados: Filme[] = entries.map(entry => ({
        id: entry.tmdb_id,
        title: entry.title,
        poster_path:
          entry.poster_url?.replace('https://image.tmdb.org/t/p/w500', '') ||
          '',
        overview: entry.overview || '',
        rating: entry.rating || undefined,
        state: entry.state,
        original_title: '',
        release_date: entry.year || '',
        original_language: '',
        vote_average: entry.rating || 0
      }))
      setFilmes(filmesNormalizados)
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
        <MovieGrid filmes={filmes} onFilmeClick={setModalFilme} />

        <ListModal
          title={showModal === 'followers' ? 'Seguidores' : 'Seguindo'}
          isOpen={!!showModal}
          onClose={() => setShowModal(null)}
          users={showModal === 'followers' ? followers : following}
        />

        {modalFilme && (
          <MovieModal filme={modalFilme} onClose={() => setModalFilme(null)} />
        )}
      </div>
    </>
  )
}
