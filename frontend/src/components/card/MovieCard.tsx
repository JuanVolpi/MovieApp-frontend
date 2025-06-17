import { useEffect, useState } from 'react'
import { Card, CardBody, Image, Spinner, Tooltip } from '@heroui/react'
import { StarIcon, BookmarkIcon } from '@heroicons/react/24/solid'
import type { Filme } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { getMovieEntry } from '@/services/historyService'

interface MovieCardProps {
  filme: Filme
  onClick: () => void
}

export default function MovieCard ({ filme, onClick }: MovieCardProps) {
  const { user } = useAuth()
  const [nota, setNota] = useState<number | null>(null)
  const [estaNaLista, setEstaNaLista] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntry = async () => {
      if (!user) return
      try {
        const entry = await getMovieEntry(user.id, filme.id ?? 0)
        setEstaNaLista(true)
        setNota(entry.rating || null)
      } catch {
        // Se não encontrar, não faz nada
        setEstaNaLista(false)
      } finally {
        setLoading(false)
      }
    }

    fetchEntry()
  }, [user, filme.id])

  return (
    <div className='hover:scale-105 transition-all duration-200 ease-in-out'>
      <Card
        isPressable
        onPress={onClick}
        className='w-full max-w-[200px] relative'
      >
        <CardBody className='p-0'>
          <Image
            src={
              filme.poster_path
                ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                : 'https://via.placeholder.com/200x300?text=Sem+Imagem'
            }
            alt={filme.title || 'Sem título'}
            className='w-full h-[300px] object-cover'
          />

          {/* Loading indicador opcional */}
          {loading && (
            <div className='absolute top-2 left-2 z-10'>
              <Spinner size='sm' />
            </div>
          )}
          {/* Nota */}
          <div className='absolute top-2 right-2 bg-black/70 text-white align-middle font-semibold text-md px-2 py-1 rounded-full flex items-center gap-1 z-10'>
            {nota !== null && (
              <>
                {nota.toFixed(1)}
                <StarIcon className='w-4 h-4 text-yellow-400' />
              </>
            )}

            {estaNaLista && !loading && (
              <Tooltip content={'Em sua lista'} color='primary'>
                <BookmarkIcon className='w-5 h-5 text-primary-500' />
              </Tooltip>
            )}
          </div>
          {/* Coração se estiver na lista */}
          <div className='absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center z-10'>
            {filme.title || 'Título indisponível'}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
