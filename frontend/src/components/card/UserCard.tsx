// src/components/card/CardUser.tsx
import { useAuth } from '@/context/AuthContext'
import { User, Link, Card, CardBody, Tooltip } from '@heroui/react'
import { div } from 'framer-motion/client'
import { useNavigate } from 'react-router-dom'

interface CardUserProps {
  avatar: string
  nome: string
  email: string
  href?: string
}

export default function CardUser ({ avatar, nome, email, href }: CardUserProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleClick = () => {
    navigate(`/perfil/${user?.id}`)
  }

  return (
    <Tooltip content='Perfil' color='default' placement='bottom'>
      <div className='hover:scale-95 transition-all duration-300 ease-in-out cursor - pointer'>
        <Card
          className={'px-4 py-2 flex justify-center items-center rounded-full'}
        >
          <User
            onClick={handleClick}
            avatarProps={{
              src: avatar ? avatar : `https://i.pravatar.cc/150?u=${user.id}`
            }}
            name={
              href ? (
                <Link href={href} className='text-base font-semibold'>
                  {nome}
                </Link>
              ) : (
                nome
              )
            }
            description={
              <span className='text-sm text-default-500'>{email}</span>
            }
            className='max-w-full'
          />
        </Card>
      </div>
    </Tooltip>
  )
}
