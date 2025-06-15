// src/components/card/CardUser.tsx
import { useAuth } from '@/context/AuthContext'
import { User, Link, Card, CardBody } from '@heroui/react'
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
    <Card
      className={
        'hover:scale-95 cursor-pointer px-4 py-2 flex justify-center items-center rounded-full'
      }
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
        description={<span className='text-sm text-default-500'>{email}</span>}
        className='max-w-full'
      />
    </Card>
  )
}
