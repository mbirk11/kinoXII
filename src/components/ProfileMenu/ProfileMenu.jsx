import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Avatar from '../Avatar/Avatar'
import useAuth from '../../hooks/useAuth'
import { getDisplayName } from '../../utils/user'
import caretIcon from '../../assets/icons/caret-down.svg'
import checkIcon from '../../assets/icons/check.svg'
import userIcon from '../../assets/icons/user.svg'
import ticketIcon from '../../assets/icons/ticket.svg'
import signOutIcon from '../../assets/icons/sign-out.svg'
import styles from './ProfileMenu.module.css'

function ProfileMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const displayName = getDisplayName(user)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (!menuRef.current.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const close = () => setIsOpen(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
      setIsOpen(false)
      if (pathname.startsWith('/profile')) navigate('/')
    }
  }

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className={styles.user}>
          <Avatar user={user} />
          <span className={styles.triggerName}>{displayName}</span>
        </span>
        <img
          className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`}
          src={caretIcon}
          alt=""
          width="16"
          height="16"
        />
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu">
          <div className={styles.top}>
            <div className={styles.identity}>
              <Avatar user={user} size={42} />
              <div className={styles.identityText}>
                <p className={styles.name}>{displayName}</p>
                <p className={styles.email}>{user.email}</p>
              </div>
            </div>

            <div className={styles.statusWrapper}>
              {user.profileComplete ? (
                <div className={`${styles.status} ${styles.complete}`}>
                  <p className={styles.statusTitle}>Profile Complete</p>
                  <img src={checkIcon} alt="" width="16" height="16" />
                </div>
              ) : (
                <div className={`${styles.status} ${styles.incomplete}`}>
                  <p className={styles.statusTitle}>Profile incomplete</p>
                  <p className={styles.statusText}>
                    Please complete your profile to enable booking
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <nav className={styles.links}>
              <Link to="/profile" className={styles.item} role="menuitem" onClick={close}>
                <img src={userIcon} alt="" width="16" height="16" />
                My Profile
              </Link>
              <Link
                to="/profile?tab=tickets"
                className={styles.item}
                role="menuitem"
                onClick={close}
              >
                <img src={ticketIcon} alt="" width="16" height="16" />
                My Tickets
              </Link>
            </nav>
            <div className={styles.divider} />
            <button
              type="button"
              className={`${styles.item} ${styles.logout}`}
              role="menuitem"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <img src={signOutIcon} alt="" width="16" height="16" />
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
