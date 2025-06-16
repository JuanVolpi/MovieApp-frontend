import { useEffect, useState, useMemo } from 'react'
import Navbar from '@/components/navbar'
import { getWatchedMovies, getWatchlist } from '@/services/historyService'
import { Filme } from '@/types'
import MovieGrid from '@/components/grid/MovieGrid'
import MovieModal from '@/components/modal/MovieModal'
import { Input, Slider, Switch, Tooltip } from '@heroui/react'
import SearchBox from '@/components/input/SearchBox'
import { useAuth } from '@/context/AuthContext'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import EyeSlashIcon from '@heroicons/react/24/solid/EyeSlashIcon'

export default function MyListPage () {
  const { user } = useAuth()
  const [entries, setEntries] = useState<any[]>([])
  const [showWatched, setShowWatched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notaMinima, setNotaMinima] = useState(0)
  const [loading, setLoading] = useState(false)
  const [modalFilme, setModalFilme] = useState<Filme | null>(null)

  const carregarFilmes = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = showWatched
        ? await getWatchedMovies(user.id)
        : await getWatchlist(user.id)
      setEntries(data)
    } catch (err) {
      console.error('Erro ao carregar filmes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarFilmes()
  }, [showWatched, user])

  const filmesFiltrados: Filme[] = useMemo(() => {
    return entries
      .filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
      .filter(entry => (showWatched ? (entry.rating || 0) >= notaMinima : true))
      .map(entry => ({
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
  }, [entries, searchQuery, notaMinima, showWatched])

  return (
    <>
      <Navbar />
      <div className='max-w-xl w-full flex flex-col m-5 mx-auto gap-5 px-4'>
        <SearchBox
          value={searchQuery}
          placeholder='Buscar na sua lista'
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <div className='flex flex-col justify-center items-center gap-3'>
          <Tooltip
            content={showWatched ? 'Ver Watchlist' : 'Ver Assistidos'}
            placement='right'
            color='primary'
          >
            <Switch
              isSelected={showWatched}
              thumbIcon={
                showWatched ? (
                  <EyeIcon className='w-5 ' />
                ) : (
                  <EyeSlashIcon className='w-5' />
                )
              }
              onChange={() => setShowWatched(!showWatched)}
            />
          </Tooltip>
          {showWatched && (
            <div className='w-full flex flex-row items-center gap-4 px-2'>
              <h3 className='text-md whitespace-nowrap'>Nota mínima:</h3>
              <Slider
                className='flex-1'
                minValue={0}
                maxValue={5}
                step={1}
                value={notaMinima}
                onChange={val => setNotaMinima(val as number)}
                marks={[
                  { value: 0, label: '0' },
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' }
                ]}
              />
              <span className='text-sm'>{notaMinima.toFixed(1)}</span>
            </div>
          )}

          {searchQuery.trim() === '' && (
            <h1 className='text-2xl font-bold text-center'>
              {showWatched ? 'Assistidos' : 'Minha Watchlist'}
            </h1>
          )}
        </div>
      </div>
      <div className='overflow-y-scroll max-h-[calc(100vh-14rem)]'>
        {loading ? (
          <p className='text-center text-gray-500'>Carregando...</p>
        ) : filmesFiltrados.length === 0 ? (
          <p className='text-center text-gray-500'>Nenhum filme encontrado.</p>
        ) : (
          <MovieGrid filmes={filmesFiltrados} onFilmeClick={setModalFilme} />
        )}
      </div>

      {modalFilme && (
        <MovieModal
          filme={modalFilme}
          onClose={() => {
            setModalFilme(null)
            carregarFilmes()
          }}
        />
      )}
    </>
  )
}
