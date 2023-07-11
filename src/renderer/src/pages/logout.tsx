import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { trpc } from '@renderer/trpcClient'

export default function Logout() {
  const { mutateAsync: logOut } = trpc.user.logout.useMutation()
  const navigate = useNavigate()
  useEffect(() => {
    async function handleLogOut() {
      await logOut()
      navigate('/user/register')
    }
    handleLogOut()
  }, [])

  return (
    <div className="h-screen bg-background flex justify-center items-center">
      <Loader2 size={100} />
    </div>
  )
}
