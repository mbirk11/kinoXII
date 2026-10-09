import { Link, useLocation } from 'react-router-dom'
import Button from '../Button/Button'
import Logo from '../Logo/Logo'
import ProfileMenu from '../ProfileMenu/ProfileMenu'
import SearchBox from '../SearchBox/SearchBox'
import useAuth from '../../hooks/useAuth'
import styles from './Navbar.module.css'

function Navbar() {
  const { user, isAuthLoading, openLogin, openRegister } = useAuth()
  // The home hero gets a stronger shadow so the navbar reads over bright images
  const isOverHero = useLocation().pathname === '/'

  return (
    <header className={`${styles.navbar} ${isOverHero ? styles.overHero : ''}`}>
      <div className={styles.inner}>
        <nav className={styles.left}>
          <Logo />
          <Link to="/sessions" className={styles.link}>
            Sessions
          </Link>
        </nav>

        <div className={styles.right}>
          <SearchBox />

          {user && <ProfileMenu />}
          {!user && !isAuthLoading && (
            <div className={styles.authButtons}>
              <Button variant="primary" onClick={openRegister}>
                Sign up
              </Button>
              <Button variant="secondary" onClick={openLogin}>
                Log in
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
