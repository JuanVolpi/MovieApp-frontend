import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Link,
  Image,
  Spinner
} from '@heroui/react'
import CustomNavbar from '@/components/navbar'

export default function LoginPage () {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await apiLogin(username, password)
      login(response.access_token)
      addToast({
        title: 'Login efetuado',
        color: 'success',
        description: 'Seja bem-vindo!',
        variant: 'solid'
      })
      navigate('/filmes')
    } catch (err: any) {
      addToast({
        title: 'Erro ao entrar',
        color: 'danger',
        description: err.response?.data?.error || 'Erro inesperado',
        variant: 'solid'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CustomNavbar />
      <div className='flex flex-col items-center justify-center -my-32 text-center min-h-screen px-4'>
        <Image
          alt='MovieApp image logo'
          className='m-5'
          src='/logo.png'
          width={240}
        />

        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <Spinner size='lg' />
          </div>
        ) : (
          <Card className='w-full max-w-md animate-fade-in'>
            <CardBody className='space-y-4'>
              <h2 className='text-center text-2xl font-semibold mb-4'>LOGIN</h2>
              <Input
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder='Nome de utilizador'
              />
              <Input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Senha'
              />
              <Button onClick={handleLogin} color='primary'>
                Entrar
              </Button>
            </CardBody>
            <CardFooter className='flex justify-between'>
              <Link href={'/register'}>Criar conta</Link>
              <Link href={'/forgot-password'}>Esqueceu a senha?</Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  )
}
