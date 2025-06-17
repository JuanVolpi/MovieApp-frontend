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
        <img src='/logo.png' alt='Logo' className='h-8' />

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
