import { useState } from 'react'
import { addToast, CardFooter } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Input, Button, Link, Image } from '@heroui/react'
import { registerUser } from '@/services/authService'
import CustomNavbar from '@/components/navbar'

export default function RegisterPage () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
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
    }
  }

  return (
    <>
      <CustomNavbar />
      <div className='flex flex-col items-center -m-32 justify-center text-center min-h-screen'>
        <Image
          alt='MovieApp image logo'
          className='m-5'
          src='/logo.png'
          width={240}
        />
        <Card className='w-full max-w-md'>
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
            <Button className='w-full' onPress={handleRegister} color='primary'>
              Criar Conta
            </Button>
          </CardBody>
          <CardFooter>
            <Link href={'/login'}>{`< voltar para login`}</Link>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
