import { UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { Button } from '@heroui/react'
import { Link } from 'react-router-dom'

interface CardUserFullProps {
  avatar: string
  nome: string
  email: string
  followersCount: number
  followingCount: number
  jaSegue: boolean
  onToggleFollow?: () => void
  href: string
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
    <div className='flex items-center justify-between p-4 bg-default-100 rounded-2xl shadow-sm'>
      <Link to={href} className='flex items-center gap-4'>
        <img
          src={avatar}
          alt={`Avatar de ${nome}`}
          className='w-14 h-14 rounded-full border border-white shadow'
        />
        <div className='space-y-0.5'>
          <h2 className='font-semibold text-md'>{nome}</h2>
          <p className='text-default-500 text-sm'>{email}</p>
          <div className='flex gap-4 text-sm text-default-500'>
            <span>
              <strong>{followersCount}</strong> Seguidores
            </span>
            <span>
              <strong>{followingCount}</strong> Seguindo
            </span>
          </div>
        </div>
      </Link>

      {onToggleFollow && (
        <Button
          onClick={onToggleFollow}
          color={jaSegue ? 'default' : 'primary'}
          variant='solid'
          startContent={
            jaSegue ? (
              <UserMinusIcon className='w-5' />
            ) : (
              <UserPlusIcon className='w-5' />
            )
          }
        >
          {jaSegue ? 'Seguindo' : 'Seguir'}
        </Button>
      )}
    </div>
  )
}
