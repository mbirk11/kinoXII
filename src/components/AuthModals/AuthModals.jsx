import useAuth from '../../hooks/useAuth'
import LoginModal from './LoginModal'

function AuthModals() {
  const { authModal } = useAuth()

  return <>{authModal === 'login' && <LoginModal isOpen />}</>
}

export default AuthModals
