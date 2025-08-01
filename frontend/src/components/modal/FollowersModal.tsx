import { useState, useEffect } from 'react'
import {
  followUser,
  unfollowUser,
  getFollowers
} from '@/services/communityService'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@heroui/react'
import CardUserFull from '../card/CardUserFull'
import { useAuth } from '@/context/AuthContext'

interface Utilizador {
  id: number
  username: string
  email: string
  avatar?: string
  followersCount: number
  followingCount: number
  jaSegue: boolean
}

interface FollowersModalProps {
  isOpen: boolean
  onClose: () => void
  userId: number
}

export default function FollowersModal ({
  isOpen,
  onClose,
  userId
}: FollowersModalProps) {
  const { user, token } = useAuth()
  const [followers, setFollowers] = useState<Utilizador[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFollowers = async () => {
    if (!userId) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getFollowers(userId)
      const formattedData = data.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        avatar: u.image_url || `https://i.pravatar.cc/150?u=${u.id}`,
        followersCount: u.followers_count || 0,
        followingCount: u.following_count || 0,
        jaSegue: u.ja_segue || false // <- ideal se a API já informa
      }))
      setFollowers(formattedData)
    } catch (err) {
      console.error('Erro ao buscar seguidores:', err)
      setError('Não foi possível carregar os seguidores.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFollow = async (targetId: number, jaSegue: boolean) => {
    if (!user || !token) return
    try {
      if (jaSegue) {
        await unfollowUser(user.id, targetId, token)
      } else {
        await followUser(user.id, targetId, token)
      }
      setFollowers(prev =>
        prev.map(u => (u.id === targetId ? { ...u, jaSegue: !jaSegue } : u))
      )
    } catch (err) {
      console.error('Erro ao alternar follow:', err)
    }
  }

  useEffect(() => {
    if (isOpen) fetchFollowers()
  }, [isOpen, userId])

  const handleClose = () => {
    setTimeout(() => {
      setFollowers([])
      setError(null)
      setIsLoading(false)
    }, 300)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      backdrop='blur'
      className='z-[1000]'
    >
      <ModalContent className='max-w-2xl'>
        <ModalHeader>
          <h2 className='text-xl font-bold'>Seguidores</h2>
        </ModalHeader>
        <ModalBody className='space-y-4 max-h-[500px] overflow-y-auto'>
          {isLoading ? (
            <p className='text-center text-gray-500'>A carregar...</p>
          ) : error ? (
            <p className='text-center text-red-500'>{error}</p>
          ) : followers.length === 0 ? (
            <p className='text-center text-gray-500'>
              Nenhum seguidor encontrado.
            </p>
          ) : (
            followers.map(user => (
              <CardUserFull
                key={user.id}
                avatar={
                  user.avatar
                    ? user.avatar
                    : `https://i.pravatar.cc/150?u=${user?.id}`
                }
                nome={user.username}
                email={user.email}
                followersCount={user.followersCount}
                followingCount={user.followingCount}
                jaSegue={user.jaSegue}
                onToggleFollow={() => handleToggleFollow(user.id, user.jaSegue)}
                href={`/perfil/${user.id}`}
              />
            ))
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant='solid' color='danger' onPress={handleClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
