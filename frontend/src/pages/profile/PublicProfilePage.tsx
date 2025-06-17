import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MovieGrid from '@/components/grid/MovieGrid'
import { Filme, User } from '@/types'
import Navbar from '@/components/navbar'
import MovieModal from '@/components/modal/MovieModal'
import FollowersModal from '@/components/modal/FollowersModal'
import FollowingModal from '@/components/modal/FollowingModal'
import UserHeader from '@/components/card/UserHeaderCard'
import { getUserById } from '@/services/communityService'
import { getWatchedMovies } from '@/services/historyService'

export default function PerfilPublico () {
  const { id } = useParams<{ id: string }>()
  const [userData, setUserData] = useState<User | null>(null)
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [modalFilme, setModalFilme] = useState<Filme | null>(null)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const uid = Number(id)
      const [user, entries] = await Promise.all([
        getUserById(uid),
        getWatchedMovies(uid)
      ])
      setUserData({
        ...user,
        avatar: user.image_url || `https://i.pravatar.cc/150?u=${user.id}`
      })

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
          followersCount={userData.followers_count} // A contagem real pode ser colocada no modal
          followingCount={userData.following_count} // se você quiser buscá-la separadamente
          onShowFollowers={() => setShowFollowersModal(true)}
          onShowFollowing={() => setShowFollowingModal(true)}
        />

        <h2 className='text-2xl font-semibold mb-4'>Assistidos</h2>
        <MovieGrid filmes={filmes} onFilmeClick={setModalFilme} />

        <FollowersModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          userId={userData.id}
        />

        <FollowingModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          userId={userData.id}
        />

        {modalFilme && (
          <MovieModal
            filme={modalFilme}
            onClose={() => setModalFilme(null)}
            userId={userData.id}
          />
        )}
      </div>
    </>
  )
}
