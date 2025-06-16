import { useEffect, useState } from 'react'
import SearchBox from '@/components/input/SearchBox'
import Navbar from '@/components/navbar'
import {
  followUser,
  unfollowUser,
  getUsersByPartialUsername,
  getFollowing
} from '@/services/communityService'
import { useAuth } from '@/context/AuthContext'
import CardUserFull from '@/components/card/CardUserFull'
import { User } from '@/types'

export default function CommunityPage () {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [following, setFollowing] = useState<number[]>([])
  const { user, token } = useAuth()

  // Carrega quem estou seguindo
  const fetchFollowing = async () => {
    if (user?.id) {
      try {
        const result = await getFollowing(user.id)
        setFollowing(result.map((u: any) => u.id))
      } catch (error) {
        console.error('Erro ao buscar following:', error)
      }
    }
  }

  // Carrega os utilizadores da pesquisa
  const fetchUsers = async (texto: string) => {
    try {
      const results = await getUsersByPartialUsername(texto)
      if (Array.isArray(results)) {
        const filtered = results.filter((u: any) => u.id !== user?.id)
        const updated = filtered.map((u: any) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          avatar: u.image_url || `https://i.pravatar.cc/150?u=${u.id}`,
          followersCount: u.followers_count || 0,
          followingCount: u.following_count || 0,
          jaSegue: following.includes(u.id)
        }))
        setUsers(updated)
      }
    } catch (err) {
      console.error('Erro ao buscar utilizadores:', err)
      setUsers([])
    }
  }

  // Atualiza follow/unfollow
  const handleFollowToggle = async (targetId: number, jaSegue: boolean) => {
    if (!user || !token) return
    try {
      if (jaSegue) {
        await unfollowUser(user.id, targetId, token)
      } else {
        await followUser(user.id, targetId, token)
      }
      await fetchFollowing()
    } catch (error) {
      console.error('Erro ao alternar follow:', error)
    }
  }

  // Refaz a busca quando muda o query
  useEffect(() => {
    if (query.trim() === '') {
      setUsers([])
      return
    }
    fetchUsers(query)
  }, [query, following])

  // Atualiza lista de quem sigo quando loga
  useEffect(() => {
    fetchFollowing()
  }, [user])

  return (
    <>
      <Navbar />
      <div className='max-w-xl w-full mx-auto mt-6 px-4'>
        <div className='flex flex-col gap-5 text-center'>
          <h1 className='text-2xl font-bold'>Comunidade</h1>
          <SearchBox
            value={query}
            onChange={setQuery}
            onClear={() => setQuery('')}
            placeholder='Pesquisar por nome ou ID...'
          />
        </div>

        {/* Lista com scroll visual, sem scroll duplo real */}
        <div className='mt-6 space-y-4 overflow-y-scroll max-h-[calc(100vh-15rem)] pr-1'>
          {users.map(u => (
            <CardUserFull
              key={`${u.id}-${u.jaSegue}`}
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
