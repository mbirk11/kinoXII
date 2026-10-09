import { useEffect, useState } from 'react'
import styles from './BookingModal.module.css'

const secondsUntil = (expiresAt) =>
  Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000))

// Counts down from the server's absolute expiry so a background tab cannot drift
function HoldTimer({ expiresAt, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(expiresAt))

  useEffect(() => {
    const tick = () => {
      const remaining = secondsUntil(expiresAt)
      setSecondsLeft(remaining)
      if (remaining === 0) onExpire()
    }
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [expiresAt, onExpire])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className={`${styles.timer} ${secondsLeft <= 60 ? styles.timerUrgent : ''}`} role="timer">
      <span className={styles.timerLabel}>Seats held</span>
      <span className={styles.timerValue}>
        {minutes}:{seconds}
      </span>
    </div>
  )
}

export default HoldTimer
