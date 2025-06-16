import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Textarea,
  Input,
  addToast
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { Filme } from '@/types'
import { useAuth } from '@/context/AuthContext'
import {
  StarIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/solid'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import {
  getMovieEntry,
  addToWatchlist,
  removeEntry,
  submitReview
} from '@/services/historyService'

interface MovieModalProps {
  filme: Filme
  onClose: () => void
}

export default function MovieModal ({ filme, onClose }: MovieModalProps) {
  const { user } = useAuth()
  const [inWatchlist, setInWatchlist] = useState(false)
  const [rating, setRating] = useState('0')
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [estado, setEstado] = useState<true | false | null>(null)

  useEffect(() => {
    if (!user?.id || !filme?.id) return

    const fetchEntry = async () => {
      try {
        const data = await getMovieEntry(user.id, filme.id)
        setEstado(data.state)
        setInWatchlist(data.state === false)
        setRating(data.rating?.toString() || '0')
        setReview(data.review_text || '')
      } catch {
        console.log('Filme ainda não tem entrada.')
        setEstado(null)
        setInWatchlist(false)
        setRating('0')
        setReview('')
      }
    }

    fetchEntry()
  }, [user?.id, filme?.id]) // <- evita múltiplas execuções

  const handleToggleWatchlist = async () => {
    if (!user) return
    setLoading(true)
    try {
      if (inWatchlist) {
        await removeEntry(user.id, filme.id)
        setInWatchlist(false)
        setEstado(null)
        addToast({
          title: 'Removido da sua lista',
          description: `${filme.title} foi removido com sucesso.`,
          color: 'primary',
          variant: 'solid'
        })
      } else {
        await addToWatchlist(user.id, filme.id)
        setInWatchlist(true)
        setEstado(false)
        addToast({
          title: 'Adicionado à sua lista',
          description: `${filme.title} foi salvo na sua lista.`,
          color: 'success',
          variant: 'solid'
        })
      }
    } catch (err) {
      console.error('Erro ao atualizar lista:', err)
      addToast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar a lista.',
        color: 'danger',
        variant: 'solid'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    const nota = parseFloat(rating)
    if (!user || isNaN(nota) || nota <= 0) {
      addToast({
        title: 'Nota inválida',
        description: 'Dê uma nota maior que 0 para submeter.',
        color: 'warning',
        variant: 'solid'
      })
      return
    }

    setLoading(true)
    try {
      await submitReview(user.id, filme.id, nota, review)

      // Aguardar um pouco para garantir que a entrada foi persistida
      await new Promise(resolve => setTimeout(resolve, 300))

      setEstado(true)
      setInWatchlist(true)

      addToast({
        title: 'Review enviada',
        description: 'Seu feedback foi registrado com sucesso!',
        color: 'success',
        variant: 'solid'
      })
    } catch (err) {
      console.error('Erro ao submeter review:', err)
      addToast({
        title: 'Erro',
        description: 'Não foi possível enviar sua review.',
        color: 'danger',
        variant: 'solid'
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={true} onClose={onClose} backdrop='blur' className='z-[1000]'>
      <ModalContent className='max-w-4xl'>
        <ModalHeader className='flex justify-between items-center'>
          <h2 className='text-xl font-bold'>{filme.title}</h2>
        </ModalHeader>

        <ModalBody className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Image
            src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
            alt={filme.title}
            radius='lg'
            className='w-full h-auto object-cover'
          />

          <div className='md:col-span-2 flex flex-col gap-4 text-sm'>
            <div className='space-y-1'>
              <p>
                <span className='font-semibold'>Título original:</span>{' '}
                {filme.original_title}
              </p>
              <p>
                <span className='font-semibold'>Idioma:</span>{' '}
                {filme.original_language.toUpperCase()}
              </p>
              <p>
                <span className='font-semibold'>Lançamento:</span>{' '}
                {filme.release_date}
              </p>
              <p>
                <span className='font-semibold'>Nota média:</span>{' '}
                {filme.vote_average.toFixed(1)} / 10
              </p>
              <p>
                <span className='font-semibold'>Descrição:</span>{' '}
                {filme.overview || 'Sem descrição.'}
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                onClick={handleToggleWatchlist}
                color={inWatchlist ? 'danger' : 'primary'}
                variant='solid'
                size='sm'
                disabled={loading}
                startContent={
                  inWatchlist ? (
                    <BookmarkSlashIcon className='w-4 h-4' />
                  ) : (
                    <BookmarkIcon className='w-4 h-4' />
                  )
                }
              >
                {inWatchlist ? 'Remover da lista' : 'Adicionar à lista'}
              </Button>

              {estado === true && (
                <span className='text-green-600 flex items-center gap-1 text-xs'>
                  <CheckCircleIcon className='w-4 h-4' /> Assistido
                </span>
              )}
            </div>

            <Input
              min={0}
              max={5}
              label='Nota'
              labelPlacement='outside'
              placeholder='0'
              startContent={<StarIcon className='w-5 text-yellow-400' />}
              type='number'
              value={rating}
              onChange={e => setRating(e.target.value)}
              disabled={loading}
            />

            <Textarea
              label='Review (opcional)'
              value={review}
              onChange={e => setReview(e.target.value)}
              disabled={loading}
              minRows={3}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color='danger'
            onPress={onClose}
            startContent={<XMarkIcon className='w-4 h-4' />}
          >
            Fechar
          </Button>

          <Button
            onClick={handleSubmitReview}
            color='success'
            disabled={loading || parseFloat(rating) <= 0}
            startContent={<PaperAirplaneIcon className='w-4 h-4' />}
          >
            Submeter review
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
