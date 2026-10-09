import TicketIcon from '../icons/TicketIcon'
import { formatPrice } from '../../utils/format'
import styles from './TicketSessionCard.module.css'

// Ticket-shaped showtime used on the movie page
function TicketSessionCard({ session, onSelect, disabled = false }) {
  const isDisabled = disabled || session.isSoldOut

  return (
    <button
      type="button"
      className={`${styles.ticket} ${isDisabled ? styles.disabled : ''}`}
      onClick={() => onSelect(session)}
      disabled={isDisabled}
      aria-label={`${session.time}, hall ${session.hall.name}, ${session.format.name}, ${session.language.name}`}
    >
      <span className={styles.main}>
        <span className={styles.time}>{session.time}</span>
        <span className={styles.tags}>
          <span className={styles.language}>{session.language.code}</span>
          <span className={styles.format}>{session.format.name}</span>
        </span>
      </span>
      <span className={styles.stub}>
        <span className={styles.price}>{formatPrice(session.price)}</span>
        <span className={styles.seats}>
          {session.isSoldOut ? (
            'Sold out'
          ) : (
            <>
              <TicketIcon size={12} />
              {session.seatsLeft} left
            </>
          )}
        </span>
      </span>
    </button>
  )
}

export default TicketSessionCard
