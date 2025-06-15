import { UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { User } from '@heroui/react'
import { Button } from '@heroui/react'

interface CardUserFullProps {
  avatar: string
  nome: string
  email: string
  followersCount: number
  followingCount: number
  jaSegue: boolean
  onToggleFollow: () => void
  href?: string
}

export default function CardUserFull ({
  avatar,
  nome,
  email,
  followersCount,
  followingCount,
  jaSegue,
  onToggleFollow,
  href
}: CardUserFullProps) {
  return (
    <div className='bg-default-100 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-md hover:shadow-lg transition-shadow'>
      <User
        name={
          <a href={href} className='text-base font-bold hover:underline'>
            {nome}
          </a>
        }
        description={<span className='text-sm text-default-500'>{email}</span>}
        avatarProps={{ src: avatar }}
        className='max-w-xs'
      />

      <div className='flex items-center gap-6 text-sm text-default-500'>
        <span>
          <span className='font-bold text-white'>{followersCount}</span>{' '}
          Seguidores
        </span>
        <span>
          <span className='font-bold text-white'>{followingCount}</span>{' '}
          Seguindo
        </span>
      </div>

      <Button
        onPress={onToggleFollow}
        variant={jaSegue ? 'ghost' : 'solid'}
        color={jaSegue ? 'default' : 'primary'}
        startContent={
          jaSegue ? (
            <UserMinusIcon className='w-5' />
          ) : (
            <UserPlusIcon className='w-5' />
          )
        }
        className='transition-colors'
      >
        {jaSegue ? 'Seguindo' : 'Seguir'}
      </Button>
    </div>
  )
}
