import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import { getFilmes, getPopular } from '@/services/filmesService'
import type { Filme } from '@/types'
import SearchBox from '@/components/input/SearchBox'
import MovieGrid from '@/components/grid/MovieGrid'
import MovieModal from '@/components/modal/MovieModal'

const MainPage = () => {
  const [query, setQuery] = useState('')
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [filmeSelecionado, setFilmeSelecionado] = useState<Filme | null>(null)
  const [isSearchEmpty, setIsSearchEmpty] = useState(false)

  const normalizePopular = (filmes: any[]): Filme[] => {
    return filmes.map(f => ({
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
      video: f.video ?? false
    }))
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
      setFilmes(resultados)
      setIsSearchEmpty(false)
    } catch (err) {
      console.error('Erro ao buscar filmes:', err)
    }
  }

  const fetchPopular = async () => {
    try {
      const resultados = await getPopular()
      setFilmes(normalizePopular(resultados))
    } catch (err) {
      console.error('Erro ao buscar populares:', err)
    }
  }

  useEffect(() => {
    fetchPopular()
    setIsSearchEmpty(true)
  }, [])

  return (
    <>
      <Navbar />
      <div className='max-w-xl w-full flex flex-col m-5 mx-auto gap-5 px-4'>
        <SearchBox
          value={query}
          placeholder='Pesquise por filmes'
          onChange={(value: string) => handleSearch(value)}
          onClear={() => {
            setQuery('')
            fetchPopular()
          }}
        />
        {isSearchEmpty ? (
          <h1 className='text-2xl font-bold text-center'>Atualidades</h1>
        ) : (
          <></>
        )}
      </div>
      <div className='overflow-y-scroll max-h-[calc(100vh-10rem)]'>
        <MovieGrid
          filmes={filmes}
          onFilmeClick={filme => setFilmeSelecionado(filme)}
        />
      </div>
      {filmeSelecionado && (
        <MovieModal
          filme={filmeSelecionado}
          onClose={() => setFilmeSelecionado(null)}
        />
      )}
    </>
  )
}

export default MainPage
