import { useState } from 'react'
import { Card, CardBody, Input, Button } from '@heroui/react'
import { addToast } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/services/authService'

export default function LoginCard () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await login(username, password)
      const { access_token, user } = response

      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))

      addToast({
        title: 'Sucesso!',
        description: 'Login realizado com sucesso.',
        color: 'success',
        variant: 'solid'
      })

      navigate('/filmes')
    } catch (err) {
      addToast({
        title: 'Erro!',
        description: 'Credenciais inválidas.',
        color: 'danger',
        variant: 'solid'
      })
    }
  }

  return (
    <Card className='max-w-sm w-full shadow-xl'>
      <CardBody className='space-y-4'>
        <h2 className='text-xl font-bold text-center'>Login</h2>

        <Input
          label='Username'
          placeholder='Digite o username'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <Input
          type='password'
          label='Password'
          placeholder='Digite a password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button fullWidth onPress={handleLogin}>
          Entrar
        </Button>
      </CardBody>
    </Card>
  )
}
