import useAuth from '../../hooks/useAuth'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

function AuthModals() {
  const { authModal } = useAuth()

  if (authModal === 'login') return <LoginModal isOpen />
  if (authModal === 'register') return <RegisterModal isOpen />
  return null
}

export default AuthModals
