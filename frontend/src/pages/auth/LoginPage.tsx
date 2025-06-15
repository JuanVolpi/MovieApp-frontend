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
  Link
} from '@heroui/react'
import CustomNavbar from '@/components/navbar'

export default function LoginPage () {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
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
    }
  }

  return (
    <>
      <CustomNavbar />
      <div className='flex flex-col items-center justify-center text-center min-h-screen'>
        <Card className='w-full max-w-md'>
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
      </div>
    </>
  )
}
