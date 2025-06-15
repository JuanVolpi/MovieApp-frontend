import Navbar from '@/components/navbar'
import { Link } from '@heroui/link'

export default function DefaultLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative flex flex-col h-screen'>
      <Navbar />
      {children}
    </div>
  )
}
