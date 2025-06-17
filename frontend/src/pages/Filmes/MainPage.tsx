import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import { getFilmes, getPopular } from '@/services/filmesService'
import { getMovieEntry } from '@/services/historyService'
import { useAuth } from '@/context/AuthContext'
import type { Filme } from '@/types'
import SearchBox from '@/components/input/SearchBox'
import MovieGrid from '@/components/grid/MovieGrid'
import MovieModal from '@/components/modal/MovieModal'
import { ScrollShadow } from '@heroui/react'

const MainPage = () => {
  const { user } = useAuth()

  const [query, setQuery] = useState('')
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [filmeSelecionado, setFilmeSelecionado] = useState<Filme | null>(null)
  const [isSearchEmpty, setIsSearchEmpty] = useState(true)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (query.trim() === '') {
      fetchPopular()
      setIsSearchEmpty(true)
    } else {
      handleSearch(query)
    }
  }, [refresh])

  useEffect(() => {
    fetchPopular()
  }, [])

  const handleRefresh = () => setRefresh(prev => !prev)

  const fetchPopular = async () => {
    try {
      const populares = await getPopular()
      const normalizados = await enrichFilmes(populares)
      setFilmes(normalizados)
    } catch (err) {
      console.error('Erro ao buscar populares:', err)
    }
  }

  const handleSearch = async (texto: string) => {
    setQuery(texto)
    if (texto.trim() === '') {
      fetchPopular()
      setIsSearchEmpty(true)
      return
    }
    try {
      const resultados = await getFilmes(texto)
      const enriquecidos = await enrichFilmes(resultados)
      setFilmes(enriquecidos)
      setIsSearchEmpty(false)
    } catch (err) {
      console.error('Erro ao buscar filmes:', err)
    }
  }

  const enrichFilmes = async (lista: any[]): Promise<Filme[]> => {
    return Promise.all(
      lista.map(async f => {
        const filmeBase: Filme = {
          id: f.tmdb_id ?? f.id,
          title: f.title,
          original_title: f.original_title ?? f.title,
          poster_path: f.poster_path ?? '',
          backdrop_path: f.backdrop_path ?? '',
          release_date: f.year ?? '',
          overview: f.overview ?? '',
          vote_average: f.vote_average ?? 0,
          vote_count: f.vote_count ?? 0,
          popularity: f.popularity ?? 0,
          genre_ids: f.genre_ids ?? [],
          adult: f.adult ?? false,
          original_language: f.original_language ?? 'en',
          video: f.video ?? false,
          list: false,
          watched: false,
          rating: 0
        }

        if (!user) return filmeBase

        try {
          const entry = await getMovieEntry(user.id, filmeBase.id ?? 0)
          return {
            ...filmeBase,
            list: entry.list,
            watched: entry.watched,
            rating: entry.rating
          }
        } catch {
          return filmeBase
        }
      })
    )
  }

  return (
    <>
      <Navbar />
      <div className='max-w-xl w-full flex flex-col m-5 mx-auto gap-5 px-4'>
        <SearchBox
          value={query}
          placeholder='Pesquise por filmes'
          onChange={handleSearch}
          onClear={() => {
            setQuery('')
            fetchPopular()
          }}
        />
        {isSearchEmpty && (
          <h1 className='text-2xl font-bold text-center'>Atualidades</h1>
        )}
      </div>

      <div className='overflow-y-scroll scrollbar-hide max-h-[calc(100vh-10rem)]'>
        <ScrollShadow hideScrollBar className='max-h-[calc(100vh-10rem)]'>
          <MovieGrid
            filmes={filmes}
            onFilmeClick={filme => setFilmeSelecionado(filme)}
          />
        </ScrollShadow>
      </div>

      {filmeSelecionado && (
        <MovieModal
          filme={filmeSelecionado}
          onClose={() => {
            setFilmeSelecionado(null)
            handleRefresh()
          }}
          onUpdate={handleRefresh}
        />
      )}
    </>
  )
}

export default MainPage
