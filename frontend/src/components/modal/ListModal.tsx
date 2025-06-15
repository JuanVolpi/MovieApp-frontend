import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@heroui/react'
import CardUser from '../card/UserCard'

interface Utilizador {
  id: number
  username: string
  email: string
  avatar?: string
}

interface ModalListaProps {
  isOpen: boolean
  onClose: () => void
  titulo: string
  lista?: Utilizador[] // agora é opcional
}

export default function ListModal ({
  isOpen,
  onClose,
  titulo,
  lista = [] // fallback para array vazio
}: ModalListaProps) {
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
          {lista.length === 0 ? (
            <p className='text-center text-gray-500'>
              Nenhum utilizador encontrado.
            </p>
          ) : (
            lista.map(user => (
              <CardUser
                key={user.id}
                avatar={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                nome={user.username}
                email={user.email}
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
