import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  addToast,
  Tooltip
} from '@heroui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import ThemeSwitch from './switch/ThemeSwitch'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import UserCard from './card/UserCard'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/20/solid'

export const MovieLogo = () => {
  return (
    <svg fill='none' height='36' viewBox='0 0 32 32' width='36'>
      <path
        clipRule='evenodd'
        d='M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z'
        fill='currentColor'
        fillRule='evenodd'
      />
    </svg>
  )
}

export default function CustomNavbar () {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    addToast({
      title: 'Logout efetuado',
      color: 'primary',
      description: 'Volte Sempre!',
      variant: 'solid'
    })
  }

  const linkClass = (path: string) =>
    location.pathname === path ? 'text-primary font-semibold' : ''

  return (
    <Navbar isBordered maxWidth='xl'>
      {/* Logo à esquerda */}
      <NavbarBrand as={Link} href='/filmes'>
        <MovieLogo />
        <p className='font-bold text-inherit ml-2'>MovieApp</p>
      </NavbarBrand>

      {/* Menu central */}
      {isClient && user && (
        <NavbarContent className='hidden sm:flex gap-6' justify='center'>
          <NavbarItem>
            <Link
              href='/community'
              className={`${linkClass('/community')} font-semibold`}
            >
              Comunidade
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href='/mylist'
              className={`${linkClass('/mylist')} font-semibold`}
            >
              Minha Lista
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}

      {/* Menu à direita */}
      <NavbarContent justify='end'>
        {isClient && user ? (
          <>
            <NavbarItem className='hidden lg:flex'>
              <UserCard avatar={''} nome={user.username} email={user.email} />
            </NavbarItem>
            <NavbarItem>
              <Tooltip content='Logout' placement='bottom' color='danger'>
                <Button
                  aria-label='Logout'
                  isIconOnly
                  startContent={
                    <ArrowLeftStartOnRectangleIcon className='w-5' />
                  }
                  color='danger'
                  variant='solid'
                  onClick={handleLogout}
                />
              </Tooltip>
            </NavbarItem>
          </>
        ) : null}
      </NavbarContent>
      <ThemeSwitch />
    </Navbar>
  )
}
