// componentes/modal/ListModal.tsx

import { useEffect } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@heroui/react'
import CardUserFull from '../card/CardUserFull'

// ... (suas interfaces Utilizador e ModalListaProps continuam iguais) ...
interface Utilizador {
  id: number
  username: string
  email: string
  avatar?: string
  followersCount: number
  followingCount: number
  jaSegue: boolean
}

interface ModalListaProps {
  isOpen: boolean
  onClose: () => void
  onOpen?: () => void // Marcamos como opcional para maior flexibilidade
  titulo: string
  lista?: Utilizador[]
  loading?: boolean
}

export default function ListModal ({
  isOpen,
  onClose,
  onOpen, // Não precisa de valor padrão aqui
  titulo,
  lista = [],
  loading = false
}: ModalListaProps) {
  useEffect(() => {
    // 👇 A MUDANÇA ESTÁ AQUI 👇
    // Agora verificamos se o modal está aberto E se onOpen é uma função antes de a chamar.
    if (isOpen && typeof onOpen === 'function') {
      onOpen()
    }
  }, [isOpen, onOpen])

  // O resto do componente continua exatamente igual...
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop='blur'
      className='z-[1000]'
    >
      <ModalContent className='max-w-2xl'>
        <ModalHeader className='flex justify-between items-center'>
          <h2 className='text-xl font-bold'>{titulo}</h2>
        </ModalHeader>
        <ModalBody className='space-y-4 max-h-[500px] overflow-y-auto'>
          {loading ? (
            <div className='flex justify-center items-center h-32'>
              <p className='text-gray-500'>A carregar...</p>
            </div>
          ) : lista.length === 0 ? (
            <p className='text-center text-gray-500'>
              Nenhum utilizador encontrado.
            </p>
          ) : (
            lista.map(user => (
              <CardUserFull
                key={user.id}
                avatar={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                nome={user.username}
                email={user.email}
                followersCount={user.followersCount || 0}
                followingCount={user.followingCount || 0}
                jaSegue={user.jaSegue || false}
                onToggleFollow={() => console.log(`Toggle follow: ${user.id}`)}
                href={`/perfil/${user.id}`}
              />
            ))
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant='flat' color='secondary' onPress={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
