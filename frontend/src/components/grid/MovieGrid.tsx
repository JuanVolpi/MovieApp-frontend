import { Filme } from '@/types'
import MovieCard from '../card/MovieCard'

interface MovieGridProps {
  filmes: Filme[]
  onFilmeClick: (filme: Filme) => void
}

export default function MovieGrid ({ filmes, onFilmeClick }: MovieGridProps) {
  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
        {filmes.map(filme => (
          <MovieCard
            key={filme.id}
            filme={filme}
            onClick={() => onFilmeClick(filme)}
          />
        ))}
      </div>
    </div>
  )
}
