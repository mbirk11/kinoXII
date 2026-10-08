import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { subscribeToMovie } from '../../api/movies'
import bellIcon from '../../assets/icons/bell.svg'
import checkIcon from '../../assets/icons/check-white.svg'
import styles from './ComingSoonCard.module.css'

function NotifyButton({ movie }) {
  const { requireAuth } = useAuth()
  const [isNotified, setIsNotified] = useState(Boolean(movie.isNotified))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleClick = () =>
    requireAuth(async () => {
      setIsSaving(true)
      setError(null)
      try {
        await subscribeToMovie(movie.slug)
        setIsNotified(true)
      } catch (requestError) {
        if (requestError.status !== 401) setError('Could not set the reminder. Try again.')
        throw requestError
      } finally {
        setIsSaving(false)
      }
    }).catch(() => {})

  if (isNotified) {
    return (
      <span className={`${styles.notify} ${styles.notified}`}>
        <img src={checkIcon} alt="" width="16" height="16" />
        Reminder set
      </span>
    )
  }

  return (
    <div className={styles.notifyWrapper}>
      <button type="button" className={styles.notify} onClick={handleClick} disabled={isSaving}>
        <img src={bellIcon} alt="" width="16" height="16" />
        {isSaving ? 'Saving...' : 'Notify Me'}
      </button>
      {error && <p className={styles.notifyError}>{error}</p>}
    </div>
  )
}

export default NotifyButton
