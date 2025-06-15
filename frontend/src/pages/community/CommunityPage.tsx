import { useEffect, useState } from 'react'
import SearchBox from '@/components/input/SearchBox'
import Navbar from '@/components/navbar'
import {
  followUser,
  unfollowUser,
  getUsersByPartialUsername
} from '@/services/communityService'
import { useAuth } from '@/context/AuthContext'
import CardUserFull from '@/components/card/CardUserFull'
import { User } from '@/types'

export default function CommunityPage () {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<
    (User & {
      avatar: string
      email: string
      followersCount: number
      followingCount: number
      jaSegue: boolean
    })[]
  >([])
  const { user, token } = useAuth()

  const fetchUser = async (texto: string) => {
    try {
      const result = await getUsersByPartialUsername(texto)
      if (result && user) {
        const jaSegue = result.followers?.some((f: any) => f.id === user.id)
        const userFinal = {
          ...result,
          avatar: result.avatar ?? `https://i.pravatar.cc/150?u=${result.id}`,
          email: result.email ?? '',
          followersCount: result.followers?.length ?? 0,
          followingCount: result.following?.length ?? 0,
          jaSegue
        }
        setUsers([userFinal])
      } else {
        setUsers([])
      }
    } catch (err) {
      console.error('Erro ao buscar utilizadores:', err)
      setUsers([])
    }
  }

  const handleFollowToggle = async (id: number, jaSegue: boolean) => {
    if (!user || !token) return
    try {
      if (jaSegue) {
        await unfollowUser(user.id, id, token)
      } else {
        await followUser(user.id, id, token)
      }
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, jaSegue: !jaSegue } : u))
      )
    } catch (err) {
      console.error('Erro ao alternar follow:', err)
    }
  }
  useEffect(() => {
    if (query.trim() !== '') fetchUser(query)
    else setUsers([])
  }, [query])

  return (
    <>
      <Navbar />
      <div className='max-w-3xl mx-auto p-4 space-y-6'>
        <h1 className='text-2xl font-bold'>Comunidade</h1>
        <SearchBox
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          placeholder='Pesquisar por nome ou ID...'
        />
        <div className='space-y-4 mt-6'>
          {users.map(u => (
            <CardUserFull
              key={u.id}
              avatar={u.avatar}
              nome={u.username}
              email={u.email}
              followersCount={u.followersCount}
              followingCount={u.followingCount}
              jaSegue={u.jaSegue}
              onToggleFollow={() => handleFollowToggle(u.id, u.jaSegue)}
              href={`/perfil/${u.id}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
