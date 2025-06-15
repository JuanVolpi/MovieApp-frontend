import { useState } from 'react'
import { requestPasswordReset } from '@/services/authService'
import { addToast, CardFooter, Link } from '@heroui/react'
import { Card, CardBody, Input, Button } from '@heroui/react'
import CustomNavbar from '@/components/navbar'

export default function ForgotPasswordPage () {
  const [email, setEmail] = useState('')

  const handleSubmit = async () => {
    try {
      const res = await requestPasswordReset(email)
      addToast({
        title: 'Verifique o email',
        description: res.message,
        variant: 'solid'
      })
    } catch (err) {
      addToast({
        title: 'Erro',
        description:
          err.response?.data?.error || 'Falha ao enviar link de reset.',
        variant: 'solid'
      })
    }
  }

  return (
    <>
      <CustomNavbar />
      <div className='flex items-center justify-center h-screen'>
        <Card className='w-full max-w-md'>
          <CardBody className='space-y-4'>
            <h1 className='text-xl font-semibold text-center'>
              Esqueceu a senha?
            </h1>
            <Input
              label='Email de recuperação'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button className='w-full' onPress={handleSubmit} color='primary'>
              Enviar link de reset
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
