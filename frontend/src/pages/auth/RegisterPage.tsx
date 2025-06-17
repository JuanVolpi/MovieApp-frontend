import { useState } from 'react'
import {
  addToast,
  CardFooter,
  Card,
  CardBody,
  Input,
  Button,
  Link,
  Image,
  Spinner
} from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '@/services/authService'
import CustomNavbar from '@/components/navbar'

export default function RegisterPage () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async () => {
    setLoading(true)
    try {
      await registerUser(username, password, email)
      addToast({
        title: 'Conta criada com sucesso!',
        color: 'success',
        description: 'Faça login para continuar.',
        variant: 'solid'
      })
      navigate('/login')
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } }
      addToast({
        title: 'Erro ao criar conta',
        color: 'danger',
        description: error.response?.data?.error || 'Erro inesperado.',
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
              <h1 className='text-xl font-semibold text-center'>Criar Conta</h1>
              <Input
                label='Nome de Utilizador'
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Input
                label='Email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                label='Senha'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                className='w-full'
                onPress={handleRegister}
                color='primary'
              >
                Criar Conta
              </Button>
            </CardBody>
            <CardFooter>
              <Link href={'/login'}>{`< voltar para login`}</Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  )
}
