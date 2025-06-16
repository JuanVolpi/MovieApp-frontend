import { Button } from '@heroui/react'

interface UserHeaderProps {
  avatar?: string
  username: string
  email?: string
  followersCount: number
  followingCount: number
  onShowFollowers: () => void
  onShowFollowing: () => void
}

export default function UserHeader ({
  avatar,
  username,
  email,
  followersCount,
  followingCount,
  onShowFollowers,
  onShowFollowing
}: UserHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8'>
      <img
        src={avatar || `https://i.pravatar.cc/150?u=${username}`}
        className='w-32 h-32 rounded-full border-2 border-white shadow-md'
        alt='avatar'
      />
      <div className='text-center sm:text-left'>
        <h1 className='text-3xl font-bold'>{username}</h1>
        {email && <p className='text-default-500'>{email}</p>}
        <div className='mt-3 flex justify-center sm:justify-start gap-4'>
          <Button size='sm' onClick={onShowFollowers}>
            Seguidores ({followersCount})
          </Button>
          <Button size='sm' onClick={onShowFollowing}>
            Seguindo ({followingCount})
          </Button>
        </div>
      </div>
    </div>
  )
}
