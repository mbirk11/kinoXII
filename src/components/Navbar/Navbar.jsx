import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import Logo from '../Logo/Logo'
import useAuth from '../../hooks/useAuth'
import searchIcon from '../../assets/icons/magnifying-glass.svg'
import caretIcon from '../../assets/icons/caret-down.svg'
import dotComplete from '../../assets/icons/status-dot-complete.svg'
import dotIncomplete from '../../assets/icons/status-dot-incomplete.svg'
import styles from './Navbar.module.css'

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

function Navbar() {
  const { user, isAuthLoading, openLogin, openRegister } = useAuth()
  const displayName = user?.fullName || user?.username

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <nav className={styles.left}>
          <Logo />
          <Link to="/sessions" className={styles.link}>
            Sessions
          </Link>
        </nav>

        <div className={styles.right}>
          <div className={styles.searchWrapper}>
            <label className={styles.search}>
              <img src={searchIcon} alt="" width="14" height="14" />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search films and live events"
              />
            </label>
          </div>

          {user ? (
            <button type="button" className={styles.profile}>
              <span className={styles.user}>
                <span className={styles.avatar}>
                  {user.avatar ? (
                    <img className={styles.avatarImage} src={user.avatar} alt="" />
                  ) : (
                    getInitials(displayName)
                  )}
                  <img
                    className={styles.statusDot}
                    src={user.profileComplete ? dotComplete : dotIncomplete}
                    alt=""
                    width="10"
                    height="10"
                  />
                </span>
                <span className={styles.userName}>{displayName}</span>
              </span>
              <img src={caretIcon} alt="" width="16" height="16" />
            </button>
          ) : isAuthLoading ? null : (
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
